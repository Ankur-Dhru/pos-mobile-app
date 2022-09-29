import {v4 as uuidv4} from "uuid";
import {setCartData} from "../redux-store/reducer/cart-data";
import store from "../redux-store/store";
import {
  appLog,
  appLog2,
  clone,
  currencyRate,
  getDefaultCurrency,
  getFloatValue,
  isEmpty,  saveTempLocalOrder,
  voucherData
} from "./function";
import {localredux, VOUCHER} from "./static";
import {setTableOrders} from "../redux-store/reducer/table-orders-data";
import moment from "moment";



export const taxtype = {inclusive: "inclusive", exclusive: "exclusive"}

export const addItem = (data: any, currentCurrency?: any, clientid?: any, canChangeSellingPrice?: boolean) => {


  try {

    let isInward: boolean = false;
    let companyCurrency = getDefaultCurrency();


    let {cartData}: any = store.getState();
    let {localSettingsData}: any = localredux;

    let client = cartData?.client;

    let pricingTemplate = localSettingsData?.taxInvoice ? client?.clientconfig?.pricingtemplate : undefined

    let isDepartmentSelected = false;

    if (!isEmpty(localSettingsData?.currentLocation?.departments)) {
      isDepartmentSelected = localSettingsData?.currentLocation?.departments.some(({departmentid}: any) => departmentid === data?.itemdepartmentid)
    }

/*    if (localSettingsData?.isRestaurant && !isDepartmentSelected) {
      alertDialog("Kitchen Department Not Selected!", <span>Please Select Kitchen For <b>{data?.itemname}</b> Item From Edit Item And Add Again.</span>, {
        negativeButtonLabel: "OK",
        negativeIntent: "primary",
        hidePositiveButton: true,
        onPositiveClick: () => {
        }
      })
    }*/


    let invoiceitems: any = []
    if (!isEmpty(cartData.invoiceitems)) {
      invoiceitems = [...cartData.invoiceitems];
    }


/*    if (data?.pricealert) {
      alertDialog("Multiple Price Alert!", <span><b>{data?.itemname}</b> With Multiple Price</span>, {
        negativeButtonLabel: "OK",
        negativeIntent: "primary",
        hidePositiveButton: true,
        onPositiveClick: () => {
        }
      })
    }*/

    if (!Boolean(currentCurrency)) {
      currentCurrency = companyCurrency;
    }

    let {
      itemid,
      itemname,
      itemtaxgroupid,
      pricing,
      productqnt,
      itemmaxqnt,
      salesunit,
      stockonhand,
      inventorytype,
      identificationtype,
      itemhsncode,
      itemtype,
      committedstock,
      itemminqnt,
        itemaddon,
      itemtags,
        notes,
        hasAddon,
        key
    } = data;



    let recurring = undefined, producttaxgroupid, productqntunitid;

    if (pricing?.type !== "free" &&
      pricing.price &&
      pricing.price.default &&
      pricing.price.default[0] &&
      pricing.price.default.length > 0) {
      recurring = Object.keys(pricing.price.default[0])[0];
    }
    if (Boolean(salesunit)) {
      productqntunitid = salesunit;
    }

    if (Boolean(itemtaxgroupid)) {
      producttaxgroupid = itemtaxgroupid;
    }


    let additem: any = {
      identificationtype,
      productid: itemid,
      productdisplayname: itemname,
      productqnt: productqnt || (Boolean(itemminqnt) ? itemminqnt : 1),
      producttaxgroupid,
      pricingtype: pricing.type,
      recurring,
      minqnt: Boolean(itemminqnt) ? parseFloat(itemminqnt) : undefined,
      maxqnt: Boolean(itemmaxqnt) ? parseFloat(itemmaxqnt) : undefined,
      productqntunitid,
      "accountid": 2,
      clientid: cartData?.clientid,
      productdiscounttype: "%",
      stockonhand,
      hsn: itemhsncode,
      itemtype: itemtype === "service" ? "service" : "goods",
      committedstock,
      inventorytype,
      itemaddon,
      itemtags,
      notes,
      hasAddon,
      isDepartmentSelected,
      ...getProductData(data, currentCurrency, companyCurrency, undefined, undefined, isInward, pricingTemplate)
    }
    if (canChangeSellingPrice) {
      let sellingPrice = getProductData(data, currentCurrency, companyCurrency, undefined, undefined, isInward, pricingTemplate)
      additem.mrp = sellingPrice.productratedisplay;
    } else {
      additem.mrp = 0;
    }


    additem.key = key;
    additem.change = true;
    additem.itemdetail = clone(data);
    additem.newitem = true;


    invoiceitems.push(additem);

    if (invoiceitems.length < 2) {
      let voucherDataJson: any = voucherData(VOUCHER.INVOICE, false);
      cartData = {
        ...cartData,
        ...voucherDataJson
      }
    }
    cartData = {
      ...cartData,
      invoiceitems,
      selectedindex: invoiceitems.length - 1
    }

     cartData = itemTotalCalculation(cartData, undefined, undefined, undefined, undefined, 2, 2, false, false);

    store.dispatch(setCartData(cartData));


  } catch (e) {
    appLog(e);
  }

}


export const getProductData = (product: any,
                               clientCurrency?: string,
                               companyCurrency?: string,
                               qnt?: number,
                               recuringType?: string,
                               isInward?: boolean,
                               pricingType?: string) => {

  let {itemminqnt, pricing, purchasecost} = product;
  const {qntranges, price, type} = pricing;

  if (!pricingType) {
    pricingType = "default";
  }

  let currency = "USD", defaultCurrency = getDefaultCurrency();
  if (companyCurrency != null) {
    currency = companyCurrency;
  } else if (defaultCurrency != null) {
    currency = defaultCurrency;
  }

  if (clientCurrency == null) {
    clientCurrency = currency;
  }


  let quantity: number = 1,
    qntRangeIndex = 0,
    productratedisplay: number = 0,
    returnObject: any = {};


  if (qnt != null) {
    quantity = qnt;
  } else if (Boolean(itemminqnt)) {
    quantity = parseFloat(itemminqnt);
  }

  if (type !== 'free' && recuringType == null && price[pricingType] && price[pricingType][0]) {
    recuringType = Object.keys(price[pricingType][0])[0];
  }


  qntranges.forEach(({start, end}: any, index: any) => {
    if (quantity >= parseFloat(start) && quantity < parseFloat(end)) {
      qntRangeIndex = index;
    }
  });

  returnObject.productrate = 0;
  returnObject.productratedisplay = 0

  if (recuringType) {

    let rate = price[pricingType][0][recuringType].baseprice;

    if (!Boolean(rate)) {
      rate = 0
    }

    if (price[pricingType][qntRangeIndex][recuringType]["currency"] &&
      price[pricingType][qntRangeIndex][recuringType]["currency"][currency] &&
      price[pricingType][qntRangeIndex][recuringType]["currency"][currency].price) {
      rate = price[pricingType][qntRangeIndex][recuringType]["currency"][currency].price;
    }

    returnObject.productrate = rate;
    if (price[pricingType][qntRangeIndex][recuringType]["currency"] &&
      price[pricingType][qntRangeIndex][recuringType]["currency"][clientCurrency]) {
      productratedisplay = price[pricingType][qntRangeIndex][recuringType]["currency"][clientCurrency].price;
    } else {
      productratedisplay = currencyRate(clientCurrency) * returnObject.productrate;
    }
    returnObject.productratedisplay = productratedisplay;
  }

  if (isInward) {
    if (!Boolean(purchasecost)) {
      purchasecost = 0;
    }
    returnObject.productrate = purchasecost;
    returnObject.productratedisplay = currencyRate(clientCurrency) * purchasecost;
  }


  return returnObject;
}

export const itemTotalCalculation = (
  values: any,
  tds: any,
  tcs: any,
  currentCurrency: any,
  companyCurrency: any,
  currentDecimalPlace: any,
  companyDecimalPlace: any,
  isDiscountAfterTax: any,
  isTypeTicket?: boolean,
  step: number = 0) => {

  if (values?.currentDecimalPlace) {
    currentDecimalPlace = values?.currentDecimalPlace;
    companyDecimalPlace = values?.currentDecimalPlace;
  }

  let globaltax: any = [], typeWiseTaxSummary: any = {};

  let {globaldiscountvalue, vouchertransitionaldiscount, discounttype, vouchertaxtype} = values;


  if (values.invoiceitems) {

    let total = grandTotal(values, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);

    // inline Discount
    values.invoiceitems = values.invoiceitems
      .filter((item: any) => Boolean(item.productid))
      .map((item: any, index: any) => {
        if (index == 0) {
          item.change = true;
        }

        if (Boolean(item?.change)) {



          if (vouchertaxtype === "inclusive" &&
            !isDiscountAfterTax) {
            item = newItemCalculation("inclusive", item, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);
          }

          item = newItemCalculation("inline", item, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);
          if (vouchertaxtype === "inclusive" &&
            isDiscountAfterTax) {
            item = newItemCalculation("inclusive", item, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);
          }

          if (Boolean(item.itemaddon)) {


            item.itemaddon = item.itemaddon.map((ai: any) => {

              ai.item_qnt = item.productqnt * ai.productqnt

              if (vouchertaxtype === "inclusive" &&
                  !isDiscountAfterTax) {
                ai = newItemCalculation("inclusive", ai, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);
              }

              ai = newItemCalculation("inline", ai, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);
              if (vouchertaxtype === "inclusive" &&
                  isDiscountAfterTax) {
                ai = newItemCalculation("inclusive", ai, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);
              }
              return ai;
            });
            values.invoiceitems[index].itemaddon = item.itemaddon;
          }

        }


        return item
      });


    if (!isTypeTicket) {

      if (vouchertaxtype === "inclusive" && !isDiscountAfterTax) {
        values.invoiceitems = values.invoiceitems.map((item: any, index: any) => {
          if (Boolean(item?.change)) {
            item = newItemCalculation("inclusive", item, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);

            if (Boolean(item.itemaddon)) {
              item.itemaddon = item.itemaddon.map((ai: any) => {
                ai.item_qnt = item.productqnt * ai.productqnt
                ai = newItemCalculation("inclusive", ai, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);
                return ai;
              })
              values.invoiceitems[index].itemaddon = item.itemaddon;
            }

          }
          return item
        })
      }

      // Global Discount
      if (Boolean(vouchertransitionaldiscount) && !isDiscountAfterTax) {
        total = grandTotal(values, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);
        values.invoiceitems = values.invoiceitems.map((item: any, index: any) => {
          if (Boolean(item?.change)) {
            item = newItemCalculation("global", item, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace,
              companyDecimalPlace, isDiscountAfterTax);

            if (Boolean(item.itemaddon)) {
              item.itemaddon = item.itemaddon.map((ai: any) => {
                ai.item_qnt = item.productqnt * ai.productqnt
                return newItemCalculation("global", ai, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax)
              });
              values.invoiceitems[index].itemaddon = item.itemaddon;
            }

          }
          return item
        })
      }

      // TAX CAL
      values.invoiceitems = values.invoiceitems.map((item: any, index: any) => {
        if (Boolean(item?.change)) {


          item = newItemCalculation("tax", item, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax)


        }
        item.product_tax_object_display.forEach((itemTax: any) => {
          const taxIndex: any = globaltax.findIndex((taxItem: any) => taxItem.taxid === itemTax.taxid);

          let typeTotal = 0;

          if (typeWiseTaxSummary[itemTax?.taxtype]) {
            typeTotal = typeWiseTaxSummary[itemTax?.taxtype];
          }
          typeWiseTaxSummary[itemTax?.taxtype] = typeTotal + itemTax?.taxprice

          if (taxIndex === -1) {
            const {taxprice, taxablerate, ...otherData} = itemTax;
            globaltax = [
              ...globaltax,
              {
                ...otherData,
                taxpricedisplay: taxprice,
                taxableratedisplay: taxablerate,
                taxprice,
                taxablerate
              }
            ]
          } else {
            let addedTax = itemTax.taxprice,
              sumtaxon = itemTax.taxablerate;
            if (globaltax[taxIndex].taxpricedisplay) {
              addedTax += globaltax[taxIndex].taxpricedisplay;
            }
            if (globaltax[taxIndex].taxableratedisplay) {
              sumtaxon += globaltax[taxIndex].taxableratedisplay;
            }

            globaltax = globaltax.map((itemTax: any, index: any) => {
              let taxpricedisplay = index === taxIndex ? addedTax : itemTax.taxpricedisplay,
                taxableratedisplay = index === taxIndex ? sumtaxon : itemTax.taxableratedisplay
              return {
                ...itemTax,
                taxpricedisplay,
                taxableratedisplay,
                taxprice: taxpricedisplay,
                taxablerate: taxableratedisplay
              }
            })
          }
        })

        if (Boolean(item.itemaddon)) {
          item.itemaddon = item.itemaddon.map((ai: any) => {

            ai.item_qnt = item.productqnt * ai.productqnt

            ai = newItemCalculation("tax", ai, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax)

            ai.product_tax_object_display.forEach((itemTax: any) => {

              const taxIndex: any = globaltax.findIndex((taxItem: any) => taxItem.taxid === itemTax.taxid);

              if (taxIndex === -1) {
                const {taxprice, taxablerate, ...otherData} = itemTax;
                globaltax = [
                  ...globaltax,
                  {
                    ...otherData,
                    taxpricedisplay: taxprice,
                    taxableratedisplay: taxablerate,
                    taxprice,
                    taxablerate
                  }
                ]
              } else {

                let addedTax = itemTax.taxprice,
                    sumtaxon = itemTax.taxablerate;
                if (globaltax[taxIndex].taxprice) {
                  addedTax += globaltax[taxIndex].taxpricedisplay;
                }
                if (globaltax[taxIndex].taxablerate) {
                  sumtaxon += globaltax[taxIndex].taxableratedisplay;
                }

                globaltax = globaltax.map((itemTax: any, index: any) => {
                  let taxpricedisplay = index === taxIndex ? addedTax : itemTax.taxpricedisplay,
                      taxableratedisplay = index === taxIndex ? sumtaxon : itemTax.taxableratedisplay
                  return {
                    ...itemTax,
                    taxpricedisplay,
                    taxableratedisplay,
                    taxprice: taxpricedisplay,
                    taxablerate: taxableratedisplay
                  }
                })
              }
            });

            return ai;
          })
          values.invoiceitems[index].itemaddon = item.itemaddon;
        }

        return item
      })

      // Global Discount
      if (Boolean(vouchertransitionaldiscount) && isDiscountAfterTax) {
        total = grandTotal(values, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);
        values.invoiceitems = values.invoiceitems.map((item: any, index: any) => {
          if (Boolean(item?.change)) {
            item = newItemCalculation("global", item, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax, values?.reversecharge);
            if (Boolean(item.itemaddon)) {
              item.itemaddon = item.itemaddon.map((ai: any) => {
                ai.item_qnt = item.productqnt * ai.productqnt
                return newItemCalculation("global", ai, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax, values?.reversecharge);
              });
              values.invoiceitems[index].itemaddon = item.itemaddon;
            }
          }
          return item
        })
      }
    }

    let inlinediscountamountdisplay: number = 0,
        globaldiscountamountdisplay: number = 0,
        subtotalamountdisplay: number = 0,
        taxbleamountdisplay: number = 0,
        totaldiscountdisplay: number = 0,
        taxamountdisplay: number = 0,
        totalamountwithoutroundoffdisplay: number = 0,
        inlinediscountamount: number = 0,
        globaldiscountamount: number = 0,
        subtotalamount: number = 0,
        taxbleamount: number = 0,
        totaldiscount: number = 0,
        taxamount: number = 0,
        totalamountwithoutroundoff: number = 0;

    values.inclusive_subtotal_display = 0;
    values.inclusive_subtotal = 0;
    values.invoiceitems.forEach((item: any, index: any) => {
      const {
        productqnt,
        pricedisplay
      } = item;

      let qnt: any = getFloatValue(productqnt),
          itemqnt: any = qnt;

      if (Boolean(item.itemaddon)) {


        item.itemaddon.forEach((ai: any) => {

          if (!Boolean(ai.item_total_global_discount_display)) {
            ai.item_total_global_discount_display = 0
          }
          if (!Boolean(ai.item_total_global_discount)) {
            ai.item_total_global_discount = 0
          }


          if (!isDiscountAfterTax && vouchertaxtype === taxtype.exclusive) {
            inlinediscountamountdisplay += (ai.item_total_inline_discount_display);
            inlinediscountamount += (ai.item_total_inline_discount);

            globaldiscountamountdisplay += (ai.item_total_global_discount_display)
            globaldiscountamount += (ai.item_total_global_discount)
          } else if (!isDiscountAfterTax && vouchertaxtype === taxtype.inclusive) {

            inlinediscountamountdisplay += (ai.item_total_inline_discount_display);
            inlinediscountamount += (ai.item_total_inline_discount);

            globaldiscountamountdisplay += (ai.item_total_global_discount_display)

            globaldiscountamount += (ai.item_total_global_discount)

            values.inclusive_subtotal_display += getFloatValue(ai.item_amount_for_subtotal_display, currentDecimalPlace)
            values.inclusive_subtotal += getFloatValue(ai.item_amount_for_subtotal, companyDecimalPlace)

          } else {


            inlinediscountamountdisplay += ((ai.productdiscountamountdisplay1 * ai.item_qnt));
            inlinediscountamount += ((ai.productdiscountamount1 * ai.item_qnt) * itemqnt);

            globaldiscountamountdisplay += ((ai.productdiscountamountdisplay2 * ai.item_qnt))
            globaldiscountamount += ((ai.productdiscountamount2 * ai.item_qnt) * itemqnt)

            // TOTAL DISCOUNT
            totaldiscountdisplay += ((ai.productdiscountamountdisplay * ai.item_qnt));
            totaldiscount += ((ai.productdiscount1 * ai.item_qnt));
          }

          // SUBTOTAL

          subtotalamountdisplay += ((ai.pricedisplay))
          subtotalamount += ((ai.price))

          // TAXABLE AMOUNT
          taxbleamountdisplay += ai.producttaxabledisplay;
          taxbleamount += ai.producttaxableamount;

          // TAX AMOUNT
          taxamountdisplay += ai.producttaxamountdisplay * itemqnt;
          taxamount += ai.producttaxamount * itemqnt;



        })
      }

      if (!Boolean(item.item_total_global_discount_display)) {
        item.item_total_global_discount_display = 0
        item.item_total_global_discount = item.item_total_global_discount_display
      }

      if (!isDiscountAfterTax && vouchertaxtype === taxtype.exclusive) {
        inlinediscountamountdisplay += item.item_total_inline_discount_display;
        values.voucherinlinediscountdisplay = getFloatValue(inlinediscountamountdisplay, currentDecimalPlace);
        values.voucherinlinediscount = values.voucherinlinediscountdisplay;

        globaldiscountamountdisplay += item.item_total_global_discount_display
        values.voucherglobaldiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
        values.voucherglobaldiscount = values.voucherglobaldiscountdisplay;

        values.voucherdiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
        values.voucherdiscount = values.voucherdiscountdisplay;

      } else if (vouchertaxtype === taxtype.inclusive) {
        inlinediscountamountdisplay += item.item_total_inline_discount_display;
        values.voucherinlinediscountdisplay = getFloatValue(inlinediscountamountdisplay, currentDecimalPlace);
        values.voucherinlinediscount = values.voucherinlinediscountdisplay;

        globaldiscountamountdisplay += item.item_total_global_discount_display
        values.voucherglobaldiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
        values.voucherglobaldiscount = values.voucherglobaldiscountdisplay;

        values.voucherdiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
        values.voucherdiscount = values.voucherdiscountdisplay;

        values.inclusive_subtotal_display += getFloatValue(item.item_amount_for_subtotal_display, currentDecimalPlace)
        values.inclusive_subtotal = values.inclusive_subtotal_display

      } else {

        inlinediscountamountdisplay += item.productdiscountamountdisplay1 * qnt;
        values.voucherinlinediscountdisplay = getFloatValue(inlinediscountamountdisplay, currentDecimalPlace);
        values.voucherinlinediscount = values.voucherinlinediscountdisplay;

        globaldiscountamountdisplay += (item.productdiscountamountdisplay2 * qnt)
        values.voucherglobaldiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
        values.voucherglobaldiscount = values.voucherglobaldiscountdisplay;

        values.voucherdiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
        values.voucherdiscount = values.voucherdiscountdisplay;

        // TOTAL DISCOUNT
        totaldiscountdisplay += item.productdiscountamountdisplay * productqnt;
        values.vouchertotaldiscountamountdisplay = getFloatValue(totaldiscountdisplay, currentDecimalPlace);
        values.vouchertotaldiscountamount = values.vouchertotaldiscountamountdisplay;
      }

      // SUBTOTAL
      subtotalamountdisplay += pricedisplay;
      values.vouchersubtotaldisplay = getFloatValue(subtotalamountdisplay, currentDecimalPlace);
      values.vouchersubtotal = values.vouchersubtotaldisplay;

      // TAXABLE AMOUNT
      taxbleamountdisplay += item.producttaxabledisplay;
      values.vouchertaxabledisplay = getFloatValue(taxbleamountdisplay, currentDecimalPlace);
      values.vouchertaxable = values.vouchertaxabledisplay;

      // TAX AMOUNT
      taxamountdisplay += item.producttaxamountdisplay;
      values.vouchertaxdisplay = getFloatValue(taxamountdisplay, currentDecimalPlace);
      values.vouchertax = values.vouchertaxdisplay;
      values.invoiceitems[index].change = false;
    })

    if (!isDiscountAfterTax && vouchertaxtype === taxtype.exclusive && discounttype === "$") {
      if (globaldiscountvalue !== values.voucherglobaldiscount) {
        let differencedisplay = getFloatValue(globaldiscountvalue - values.voucherglobaldiscountdisplay, companyDecimalPlace);
        globaldiscountamountdisplay = values.voucherglobaldiscount + differencedisplay

        values.voucherglobaldiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
        values.voucherglobaldiscount = values.voucherglobaldiscountdisplay;

        values.voucherdiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
        values.voucherdiscount = values.voucherdiscountdisplay;
      }
    }
    if (!isDiscountAfterTax && vouchertaxtype === taxtype.exclusive) {
      totaldiscountdisplay += (inlinediscountamountdisplay + globaldiscountamountdisplay);
      values.vouchertotaldiscountamountdisplay = getFloatValue(totaldiscountdisplay, currentDecimalPlace);
      values.vouchertotaldiscountamount = values.vouchertotaldiscountamountdisplay;
    } else if (!isDiscountAfterTax && vouchertaxtype === taxtype.inclusive) {
      totaldiscountdisplay += (inlinediscountamountdisplay + globaldiscountamountdisplay);
      values.vouchertotaldiscountamountdisplay = getFloatValue(totaldiscountdisplay, currentDecimalPlace);
      values.vouchertotaldiscountamount = values.vouchertotaldiscountamountdisplay;
    }

    globaltax = globaltax.map((taxdata: any) => {
      if (vouchertaxtype !== "inclusive") {
        taxdata.taxableratedisplay = getFloatValue(taxdata.taxableratedisplay, companyDecimalPlace);
        taxdata.taxablerate = taxdata.taxableratedisplay;
        taxdata.taxpricedisplay = getFloatValue(taxdata.taxableratedisplay * parseFloat(taxdata.taxpercentage) / 100, currentDecimalPlace)
        taxdata.taxprice = taxdata.taxpricedisplay
      } else {
        taxdata.taxableratedisplay = getFloatValue(taxdata.taxableratedisplay, companyDecimalPlace);
        taxdata.taxablerate = taxdata.taxableratedisplay;
        taxdata.taxpricedisplay = getFloatValue(taxdata.taxpricedisplay, currentDecimalPlace)
        taxdata.taxprice = taxdata.taxpricedisplay
      }
      return taxdata;
    })

    // TOTAL WITHOUT ROUND OFF
    if (vouchertaxtype !== "inclusive") {
      totalamountwithoutroundoffdisplay = values.vouchersubtotaldisplay - (isNaN(totaldiscountdisplay) ? 0 : totaldiscountdisplay);
    } else {
      totalamountwithoutroundoffdisplay = values.vouchertaxabledisplay + values.vouchertaxdisplay;

      if (vouchertaxtype === taxtype.inclusive) {
        let subtotaldisplay = values.inclusive_subtotal_display,
          disaountdisplay = 0;

        values.vouchersubtotaldisplay = subtotaldisplay + inlinediscountamountdisplay;
        values.vouchersubtotal = values.vouchersubtotaldisplay;
        // GLOBAL DISCOUNT

        if (Boolean(globaldiscountvalue)) {
          disaountdisplay = fullDiscount(subtotaldisplay, globaldiscountvalue, "%");
        }
        totalamountwithoutroundoffdisplay = subtotaldisplay - disaountdisplay;
      }
    }

    if (vouchertaxtype === "exclusive") {
      globaltax.forEach((t: any) => {
        if (!Boolean(values?.reversecharge)) {
          totalamountwithoutroundoffdisplay = totalamountwithoutroundoffdisplay + getFloatValue(t.taxpricedisplay, currentDecimalPlace);
        }
      })
    }
    values.totalwithoutroundoffdisplay = getFloatValue(totalamountwithoutroundoffdisplay, currentDecimalPlace);
    values.totalwithoutroundoff = values.totalwithoutroundoffdisplay;
    if (Boolean(values.adjustmentamount)) {
      values.totalwithoutroundoffdisplay = getFloatValue(values.totalwithoutroundoffdisplay + parseFloat(values.adjustmentamount), currentDecimalPlace);
      values.totalwithoutroundoff = values.totalwithoutroundoffdisplay;
    }


    // const isTDS = values.selectedtdstcs === "TDS";
    // if (Boolean(tds) || Boolean(tcs)) {
    //
    //   if ((isTDS && Boolean(values.tdsaccount)) || (!isTDS && Boolean(values.tcsaccount))) {
    //
    //     if (isTDS) {
    //       const percentagevalue = tds[values.tdsaccount]?.tdsrate
    //       if (vouchertaxtype === taxtype.exclusive) {
    //         let subtotalAmountDisplay = values.vouchersubtotaldisplay;
    //         if (!isDiscountAfterTax) {
    //           subtotalAmountDisplay -= values.voucherglobaldiscountdisplay
    //         }
    //         let tdsAmountDisplay = getFloatValue(findPercentageAmount(subtotalAmountDisplay, percentagevalue), currentDecimalPlace);
    //
    //         values.tdstcsamountdisplay = tdsAmountDisplay;
    //         values.tdstcsamount = values.tdstcsamountdisplay;
    //
    //         values.tdsamountdisplay = values.tdstcsamountdisplay;
    //         values.tdsamount = values.tdsamountdisplay;
    //
    //         values.totalwithoutroundoffdisplay = getFloatValue(values.totalwithoutroundoffdisplay - tdsAmountDisplay, currentDecimalPlace)
    //         values.totalwithoutroundoff = values.totalwithoutroundoffdisplay
    //       } else {
    //         let subtotalAmountDisplay = 0;
    //         values.invoiceitems.forEach((item: any) => {
    //           subtotalAmountDisplay += item.item_total_inclusive_display
    //         })
    //
    //         if (!isDiscountAfterTax) {
    //           subtotalAmountDisplay -= values.voucherglobaldiscountdisplay
    //         }
    //         let tdsAmountDisplay = getFloatValue(findPercentageAmount(subtotalAmountDisplay, percentagevalue), currentDecimalPlace);
    //
    //         values.tdstcsamountdisplay = tdsAmountDisplay;
    //         values.tdstcsamount = values.tdstcsamountdisplay;
    //
    //         values.tdsamountdisplay = values.tdstcsamountdisplay;
    //         values.tdsamount = values.tdsamountdisplay;
    //
    //         values.totalwithoutroundoffdisplay = getFloatValue(values.totalwithoutroundoffdisplay - tdsAmountDisplay, currentDecimalPlace)
    //         values.totalwithoutroundoff = values.totalwithoutroundoffdisplay
    //       }
    //
    //     } else {
    //       // TCS CALCULATION
    //       const percentagevalue = tcs[values.tcsaccount]?.tcsrate
    //
    //       let tcsAmountDisplay = getFloatValue(findPercentageAmount(values.totalwithoutroundoffdisplay, percentagevalue), currentDecimalPlace);
    //       values.totalwithoutroundoffdisplay = getFloatValue(values.totalwithoutroundoffdisplay + tcsAmountDisplay, currentDecimalPlace)
    //       values.tdstcsamountdisplay = getFloatValue(tcsAmountDisplay, currentDecimalPlace);
    //       values.tcsamountdisplay = values.tdstcsamountdisplay;
    //
    //       values.totalwithoutroundoff = values.totalwithoutroundoffdisplay
    //       values.tdstcsamount = values.tdstcsamountdisplay;
    //       values.tcsamount = values.tdstcsamount;
    //     }
    //   }
    // }


    // TOTAL ROUND OFF
    values.vouchertotaldisplay = getRoundOffValue(values.roundoffselected, values.totalwithoutroundoffdisplay, currentDecimalPlace);
    values.vouchertotal = values.vouchertotaldisplay;

    // ROUND OFF AMOUNT
    values.voucherroundoffdisplay = getFloatValue(values.vouchertotaldisplay - values.totalwithoutroundoffdisplay, currentDecimalPlace);
    values.voucherroundoff = values.voucherroundoffdisplay;


    if (values.invoiceitems && values.invoiceitems.length > 0 && values.invoiceitems[0].pricenew) {
      compareInwardOutward(values, globaltax, companyDecimalPlace)
    }
  }

  values.globaltax = globaltax;
  values.typeWiseTaxSummary = Object.keys(typeWiseTaxSummary).map((key: any) => {
    return {
      taxtype: key,
      taxprice: getFloatValue(typeWiseTaxSummary[key], currentDecimalPlace)
    }
  });

  return values

  //return clone(values)
}

export const newItemCalculation = (
  process: string,
  item: any,
  total_amount_display: any,
  total_amount: any,
  global_discount_value: any,
  global_discount_type: any,
  voucher_tax_type: any,
  currentDecimalPlace: any,
  companyDecimalPlace: any,
  isDiscountAfterTax: any,
  isReverseCharge: boolean = false
) => {

  // CHANGE_CODE_DATE:[CHANGE_QNT - 25.04.2021] - change qnt param because addon come with  itemqnt * addonqnt and
  //  item come item qnt
  let {
    item_qnt,
    productqnt,
    productratedisplay,
    productdiscountvalue,
    productdiscounttype,
    producttaxgroupid,
    product_discount_amount_display,
    product_global_discount_amount_display,
    product_total_discount_amount_display,
    product_taxable_amount_display,
    product_tax_amount_display,
    product_tax_object_display,
    product_tax_object,
    product_inclusive_taxable_display,
    item_total_inclusive_display,
    item_total_inline_discount,
    item_total_inline_discount_display,
    item_total_global_discount_display,
    item_amount_for_subtotal_display,
  } = item;

  if (item_qnt) {
    productqnt = item_qnt;
  }

  if (!Boolean(product_inclusive_taxable_display)) {
    product_inclusive_taxable_display = 0;
  }

  if (!Boolean(item_total_inline_discount)) {
    item_total_inline_discount = 0;
  }
  if (!Boolean(item_total_inline_discount_display)) {
    item_total_inline_discount_display = 0;
  }

  if (!Boolean(item_total_global_discount_display)) {
    item_total_global_discount_display = 0;
  }

  if (!Boolean(item_total_inclusive_display)) {
    item_total_inclusive_display = 0;
  }


  let return_object: any = {},
    product_qnt: number = getFloatValue(productqnt),
    product_discount_value: number = productdiscountvalue,
    product_discount_type: string = productdiscounttype,
    product_global_discount_value: number = global_discount_value,
    product_global_discount_type: string = global_discount_type,
    product_tax_group_id: string = producttaxgroupid,
    voucher_total_amount_for_discount: number = 0,
    voucher_total_amount_for_discount_display: number = 0,
    product_rate_display: number = getFloatValue(productratedisplay),
    for_tax_display: number = 0;


  if (!Boolean(product_tax_object)) {
    product_tax_object = [];
  }
  if (!Boolean(product_tax_object_display)) {
    product_tax_object_display = [];
  }

  return_object.item_total_amount_display = getFloatValue(product_qnt * product_rate_display, currentDecimalPlace);
  return_object.item_total_amount = return_object.item_total_amount_display;

  if (!Boolean(item_amount_for_subtotal_display)) {
    return_object.item_amount_for_subtotal_display = return_object.item_total_amount_display;
    return_object.item_amount_for_subtotal = return_object.item_amount_for_subtotal_display;
  }


  if (process === "inline") {
    product_taxable_amount_display = product_rate_display;
    for_tax_display = product_taxable_amount_display;

    return_object.item_amount_for_subtotal_display = return_object.item_total_amount_display - getFloatValue(fullDiscount(return_object.item_total_amount_display, product_discount_value, product_discount_type), companyDecimalPlace);
    return_object.item_amount_for_subtotal = return_object.item_amount_for_subtotal_display;

  } else {
    for_tax_display = product_taxable_amount_display;

    let new_taxable_display = product_taxable_amount_display;

    product_taxable_amount_display = new_taxable_display > 0 ? new_taxable_display : product_rate_display;
  }

  // SET LAST VALUE START
  if (total_amount_display) {
    voucher_total_amount_for_discount_display = total_amount_display;
    voucher_total_amount_for_discount = voucher_total_amount_for_discount_display;
  }


  // SET LAST VALUE END

  // PRODUCT INLINE DISCOUNT START
  if (process === "inline") {
    const {discount: discountdisplay} = discountCalc(product_discount_value, product_taxable_amount_display, product_qnt, 0, false, product_discount_type, currentDecimalPlace);

    product_discount_amount_display = discountdisplay
    product_total_discount_amount_display = product_discount_amount_display;
    product_taxable_amount_display = product_taxable_amount_display - product_discount_amount_display;

    if (voucher_tax_type === taxtype.inclusive) {
      return_object.item_total_inline_discount_display = getFloatValue(fullDiscount(item_total_inclusive_display, product_discount_value, product_discount_type), currentDecimalPlace);
      return_object.item_total_inline_discount = return_object.item_total_inline_discount_display;
    } else {
      return_object.item_total_inline_discount_display = getFloatValue(fullDiscount(return_object.item_total_amount_display, product_discount_value, product_discount_type), currentDecimalPlace);
      return_object.item_total_inline_discount = return_object.item_total_inline_discount_display;
    }

  }
  // PRODUCT INLINE DISCOUNT END

  // PRODUCT GLOBAL DISCOUNT START
  if (process === "global") {

    let product_amount_display = product_taxable_amount_display;

    if (isDiscountAfterTax && !isReverseCharge) {
      product_amount_display = product_taxable_amount_display + (product_tax_amount_display / product_qnt);
    }

    const {discount: discountdisplay} = discountCalc(product_global_discount_value, product_amount_display, product_qnt, voucher_total_amount_for_discount_display, true, product_global_discount_type, currentDecimalPlace);
    product_global_discount_amount_display = discountdisplay;

    product_total_discount_amount_display += product_global_discount_amount_display;

    product_taxable_amount_display = product_taxable_amount_display - product_global_discount_amount_display;

    if (!isDiscountAfterTax) {
      if (voucher_tax_type === taxtype.exclusive) {
        let itempricedisplay = return_object.item_total_amount_display - item_total_inline_discount_display;
        return_object.item_total_global_discount_display = getFloatValue(fullDiscount(itempricedisplay, global_discount_value, global_discount_type, voucher_total_amount_for_discount), currentDecimalPlace);
        return_object.item_total_global_discount = return_object.item_total_global_discount_display;
      } else if (voucher_tax_type === taxtype.inclusive) {
        return_object.item_total_global_discount_display = getFloatValue(fullDiscount(item_total_inclusive_display, global_discount_value, "%"), currentDecimalPlace);
        return_object.item_total_global_discount = return_object.item_total_global_discount_display;
      }
    } else {
      if (voucher_tax_type === taxtype.inclusive) {
        return_object.item_total_global_discount_display = getFloatValue(fullDiscount(item_total_inclusive_display + item.item_total_tax_amount, global_discount_value, "%"), currentDecimalPlace);
        return_object.item_total_global_discount = return_object.item_total_global_discount_display;
      }
    }
  }
  // PRODUCT GLOBAL DISCOUNT END

  // PRODUCT INCLUSIVE TAX START
  if (process === "inclusive") {
    product_taxable_amount_display = inclusiveTaxCalc(product_tax_group_id, product_taxable_amount_display, currentDecimalPlace)

    return_object.item_total_inclusive_display = getFloatValue(inclusiveTaxCalc(product_tax_group_id, return_object.item_total_amount_display, currentDecimalPlace), companyDecimalPlace);
    return_object.item_total_inclusive = return_object.item_total_inclusive_display;
  }
  // PRODUCT INCLUSIVE TAX END

  // PRODUCT TAX START
  if (process === "tax") {

    const {
      totalTax: totalTaxDisplay,
      taxes: taxesDisplay,
      taxableValue: taxableValueDisplay
    } = taxCalc(product_tax_group_id, for_tax_display, product_qnt, voucher_tax_type, companyDecimalPlace, product_rate_display - product_total_discount_amount_display);

    product_tax_object_display = taxesDisplay;
    product_taxable_amount_display = taxableValueDisplay;
    product_tax_amount_display = totalTaxDisplay;

    product_inclusive_taxable_display = product_taxable_amount_display;

    if (!isDiscountAfterTax && voucher_tax_type === taxtype.exclusive) {

      let amountfortaxdisplay = return_object.item_total_amount_display - (item_total_inline_discount_display + item_total_global_discount_display)
      const {
        taxes: taxesDisplay,
      } = taxCalc(product_tax_group_id, amountfortaxdisplay, 1, voucher_tax_type, companyDecimalPlace, product_rate_display - product_total_discount_amount_display);

      product_tax_object_display = taxesDisplay;
    } else if (voucher_tax_type === taxtype.inclusive) {
      let amountfortaxdisplay = item_total_inclusive_display - (item_total_inline_discount_display)
      if (!isDiscountAfterTax) {
        amountfortaxdisplay -= item_total_global_discount_display
      }
      const {
        totalTax: totalTaxDisplay,
        taxes: taxesDisplay,
        taxableValue: taxableValueDisplay
      } = taxCalc(product_tax_group_id, amountfortaxdisplay, 1, voucher_tax_type, companyDecimalPlace);

      product_tax_object_display = taxesDisplay;
      return_object.item_total_taxable_amount_display = taxableValueDisplay;
      return_object.item_total_tax_amount_display = totalTaxDisplay;


      if (Boolean(product_discount_value) && Boolean(product_discount_type) && product_discount_value !== 0) {
        let display_subtotal = getFloatValue(((item_total_inclusive_display + totalTaxDisplay) - item_total_inline_discount_display), currentDecimalPlace);

        if (product_discount_type === "%") {
          const v1_display = getFloatValue(fullDiscount(return_object.item_total_amount_display, product_discount_value, product_discount_type), currentDecimalPlace);
          const v2_display = getFloatValue(return_object.item_total_amount_display - v1_display, currentDecimalPlace);
          const difference_display = getFloatValue(v2_display - display_subtotal, currentDecimalPlace)
          if (Math.abs(difference_display) < 0.03) {
            display_subtotal += difference_display;
          }
        }
        return_object.item_amount_for_subtotal_display = getFloatValue(display_subtotal, currentDecimalPlace);
        return_object.item_amount_for_subtotal = return_object.item_amount_for_subtotal_display;
      }


      return_object.item_total_taxable_amount = taxableValueDisplay;
      return_object.item_total_tax_amount = totalTaxDisplay;
    }

    let totalTaxPercentageDisplay = 0;
    product_tax_object_display.forEach(({taxpercentage}: any) => {
      totalTaxPercentageDisplay += getFloatValue(taxpercentage);
    });
    appLog2("totalTaxPercentageDisplay", totalTaxPercentageDisplay);
    return_object.totalTaxPercentageDisplay = totalTaxPercentageDisplay;
  }
  // PRODUCT TAX END

  // FOR CALCULATION DATA START
  return_object.product_qnt = product_qnt;

  return_object.product_total_price_display = product_qnt * product_rate_display;
  return_object.product_total_price = return_object.product_total_price_display;

  return_object.product_discount_amount_display = product_discount_amount_display;
  return_object.product_discount_amount = product_discount_amount_display;

  return_object.product_global_discount_amount_display = product_global_discount_amount_display;
  return_object.product_global_discount_amount = product_global_discount_amount_display;

  return_object.product_total_discount_amount_display = product_total_discount_amount_display;
  return_object.product_total_discount_amount = product_total_discount_amount_display;

  return_object.product_taxable_amount_display = product_taxable_amount_display;
  return_object.product_taxable_amount = product_taxable_amount_display;

  return_object.product_tax_amount_display = product_tax_amount_display;
  return_object.product_tax_amount = product_tax_amount_display;

  return_object.product_tax_object_display = product_tax_object_display;
  return_object.product_tax_object = product_tax_object_display;

  return_object.product_amount_display = getFloatValue(product_taxable_amount_display + (product_tax_amount_display / product_qnt));
  return_object.product_amount = return_object.product_amount_display;
  // FOR CALCULATION DATA END

  // POST SET
  return_object.productratetaxabledisplay = getFloatValue(product_taxable_amount_display);
  return_object.productratetaxable = return_object.productratetaxabledisplay;

  return_object.pricedisplay = getFloatValue(product_qnt * product_rate_display, currentDecimalPlace);
  return_object.price = return_object.pricedisplay;

  return_object.producttaxabledisplay = getFloatValue(product_taxable_amount_display * product_qnt, currentDecimalPlace);
  return_object.producttaxableamount = return_object.producttaxabledisplay;

  return_object.productdiscountamountdisplay1 = product_discount_amount_display;
  return_object.productdiscountamount1 = product_discount_amount_display;

  //CHANGE_CODE_DATE [FOR_INLINE - 22-04-2021] - for inline discount by akashbhai
  return_object.product_inclusive_taxable_display = product_inclusive_taxable_display;
  return_object.product_inclusive_taxable = product_inclusive_taxable_display;
  //CHANGE_CODE_DATE [REMOVE DISCOUNT - 23-04-2021] - Remove discount from price new by akashbhai
  if (voucher_tax_type === "inclusive") {
    return_object.pricedisplaynew = getFloatValue(item_total_inclusive_display, currentDecimalPlace);
    return_object.pricenew = return_object.pricedisplaynew;
    if (!isDiscountAfterTax && Boolean(global_discount_value) && parseFloat(global_discount_value) !== 0) {
      return_object.pricedisplaynew = getFloatValue(item_total_inclusive_display, currentDecimalPlace);
      return_object.pricenew = return_object.pricedisplaynew;
    }
  } else {
    return_object.pricedisplaynew = getFloatValue(return_object.item_total_amount_display, currentDecimalPlace);
    return_object.pricenew = return_object.pricedisplaynew;
  }


  return_object.productdiscountamountdisplay2 = product_global_discount_amount_display;
  return_object.productdiscountamount2 = return_object.productdiscountamountdisplay2;

  if (!Boolean(product_global_discount_amount_display)) {
    product_global_discount_amount_display = 0
  }
  return_object.productdiscountamountdisplay = product_discount_amount_display + product_global_discount_amount_display;
  return_object.productdiscount1 = return_object.productdiscountamountdisplay;

  return_object.productamountdisplay = getFloatValue((product_taxable_amount_display + (product_tax_amount_display / product_qnt)) * product_qnt);
  return_object.productamount = return_object.productamountdisplay;

  return_object.taxobjdisplay = product_tax_object_display;
  return_object.taxobj = return_object.taxobjdisplay;

  return_object.producttaxamountdisplay = getFloatValue(product_tax_amount_display);
  return_object.producttaxamount = return_object.producttaxamountdisplay;

  return_object.productamountdisplay1 = 0;
  return_object.productamount1 = 0;


  return clone({...item, ...return_object});
}

export const grandTotal = (values: any, currentDecimalPlace: any, companyDecimalPlace: any, isDiscountAfterTax: any) => {

  let totalAmountForDiscountDisplay: any = 0, totalAmountForDiscount: any = 0;

  const {invoiceitems} = values;
  if (invoiceitems && invoiceitems.length > 0) {
    invoiceitems.forEach((item: any, index: any) => {

      if(Boolean(item)) {
        let rateDisplay = getFloatValue(item.productratetaxabledisplay, currentDecimalPlace),
            quantity = getFloatValue(item.productqnt);

        totalAmountForDiscountDisplay += rateDisplay * quantity;
        if (isDiscountAfterTax && !Boolean(values?.reversecharge)) {
          totalAmountForDiscountDisplay += item.producttaxamountdisplay;
        }

        if (Boolean(item.itemaddon)) {
          item.itemaddon.map((ai: any) => {
            let addonratedisplay = getFloatValue(ai.productratedisplay, currentDecimalPlace),
                addonrate = getFloatValue(ai.productrate, companyDecimalPlace),
                addonproductqnt = getFloatValue(ai.productqnt);

            totalAmountForDiscountDisplay += (((addonratedisplay - ai.productdiscountamountdisplay1) * addonproductqnt) * quantity);
            totalAmountForDiscount += (((addonrate - ai.productdiscountamount1) * addonproductqnt) * quantity);

            if (isDiscountAfterTax && !Boolean(values?.reversecharge)) {
              totalAmountForDiscountDisplay += (ai.producttaxamountdisplay * quantity);
              totalAmountForDiscount += (ai.producttaxamount * quantity);
            }
            return true
          })
        }

      }


    });
  }

  return {totalAmountForDiscountDisplay, totalAmountForDiscount: totalAmountForDiscountDisplay}
}

export const fullDiscount = (discounton: any, discountvalue: any, discounttype: string, total?: any) => {
  let discountAmount = 0;
  if (discounttype === "%") {
    discountAmount = getFloatValue((discounton * discountvalue) / 100);
  } else {
    if (total) {
      // CHANGE_CODE_DATE - ()
      discountAmount = discounton * discountvalue / total
    } else {
      discountAmount = discountvalue;
    }
  }
  return discountAmount
}

export let findPercentageAmount = (amount: any, percent: any) => {
  return ((amount * percent) / 100)
}

export const getRoundOffValue = (type: string, total: any, fractionDigits: number) => {
  let roundtotal: any = total;
  if (type !== "disable") {
    if (type === "auto") {
      roundtotal = Math.round(total)
    }
    if (type === "up") {
      roundtotal = Math.ceil(total)
    }
    if (type === "down") {
      roundtotal = Math.floor(total)
    }
  }
  return getFloatValue(roundtotal, fractionDigits)
}

export const compareInwardOutward = (data: any, taxes: any, decimalplace: any) => {
  const {vouchertype, invoiceitems, voucherroundoff, adjustmentamount, tcsamount, tdsamount} = data;
  let creditValue = 0, debitValue = 0, maxDifference = 0.05;

  if (data?.vouchertaxtype == "inclusive") {
    maxDifference = 0.80;
  }

  if (vouchertype === "outward") {
    invoiceitems.forEach((item: any) => {
      appLog2("pricenew", getFloatValue(item.pricenew, decimalplace))
      creditValue += getFloatValue(item.pricenew, decimalplace);
      //CHANGE_CODE_DATE - [ADD_ADDON - 04.05.2021] - add adoon for price new

    });
    appLog2("totalcredit1", creditValue)
    taxes.forEach((tax: any) => {
      appLog2("taxes", getFloatValue(tax.taxprice, decimalplace))
      creditValue += getFloatValue(tax.taxprice, decimalplace)
    })
    appLog2("totalcredit2", creditValue)
    debitValue += getFloatValue(data.vouchertotal, decimalplace);
    if (voucherroundoff < 0) {
      debitValue += getFloatValue(Math.abs(voucherroundoff), decimalplace)
    } else {
      appLog2("roundoffelse", getFloatValue(voucherroundoff, decimalplace))
      creditValue += getFloatValue(voucherroundoff, decimalplace)
    }
    appLog2("totalcredit3", creditValue)
    debitValue += getFloatValue(data.voucherglobaldiscount, decimalplace);
    appLog2("data.voucherglobaldiscount", getFloatValue(data.voucherglobaldiscount, decimalplace))
    appLog2("debitValue", debitValue)
    debitValue += getFloatValue(data.voucherinlinediscount, decimalplace);
    appLog2("data.voucherinlinediscount", getFloatValue(data.voucherinlinediscount, decimalplace))
    appLog2("debitValue", debitValue)
    if (Boolean(tdsamount)) {
      debitValue += getFloatValue(Math.abs(tdsamount), decimalplace)
    }
    if (Boolean(tcsamount)) {
      appLog2("tcsamount", getFloatValue(Math.abs(tcsamount), decimalplace))
      creditValue += getFloatValue(Math.abs(tcsamount), decimalplace)
    }
    //CHANGE_CODE_DATE = [SETERRORE - 27.04.2021] - By mistake set roundoff
    if (Boolean(adjustmentamount)) {
      if (adjustmentamount < 0) {
        debitValue += getFloatValue(Math.abs(adjustmentamount), decimalplace)
        appLog2("adjustmentamount", Math.abs(adjustmentamount))
        appLog2("debitValue", debitValue)
      } else {
        creditValue += getFloatValue(Math.abs(adjustmentamount), decimalplace)
        appLog2("adjustmentamount", Math.abs(adjustmentamount))
        appLog2("creditValue", creditValue)
      }
    }
    appLog2("debitValue", debitValue)
    appLog2("creditValue", creditValue)
    let difference = getFloatValue(debitValue - creditValue, decimalplace);
    appLog2("difference", difference)
    if (Math.abs(difference) < maxDifference) {
      data.invoiceitems[0].pricenew = getFloatValue(invoiceitems[0].pricenew + difference, decimalplace);
    }
  } else {
    invoiceitems.forEach((item: any) => {
      debitValue += getFloatValue(item.pricenew, decimalplace);
      //CHANGE_CODE_DATE - [ADD_ADDON - 04.05.2021] - add adoon for price new

    });
    taxes.forEach((tax: any) => {
      debitValue += getFloatValue(tax.taxprice, decimalplace)
    })
    creditValue += getFloatValue(data.vouchertotal, decimalplace);
    if (voucherroundoff < 0) {
      creditValue += getFloatValue(Math.abs(voucherroundoff), decimalplace)
    } else {
      debitValue += getFloatValue(voucherroundoff, decimalplace)
    }
    creditValue += getFloatValue(data.voucherglobaldiscount, decimalplace);
    creditValue += getFloatValue(data.voucherinlinediscount, decimalplace);
    if (Boolean(tdsamount)) {
      creditValue += getFloatValue(Math.abs(tdsamount), decimalplace)
    }
    if (Boolean(tcsamount)) {
      debitValue += getFloatValue(Math.abs(tcsamount), decimalplace)
    }
    //CHANGE_CODE_DATE = [SETERRORE - 27.04.2021] - By mistake set roundoff
    if (Boolean(adjustmentamount)) {
      if (adjustmentamount < 0) {
        creditValue += getFloatValue(Math.abs(adjustmentamount), decimalplace)
      } else {
        debitValue += getFloatValue(adjustmentamount, decimalplace)
      }
    }
    let difference = getFloatValue(creditValue - debitValue, decimalplace);
    if (Math.abs(difference) < maxDifference) {
      data.invoiceitems[0].pricenew = getFloatValue(invoiceitems[0].pricenew + difference, decimalplace);
    }
  }
}

export const discountCalc = (discountValue: any, rate: any, qnt: any, totalAmount: any, isGlobal: any, discounttype: any, fraxtionDigits?: number) => {
  rate = getFloatValue(rate);
  let discountAmount: any = 0;
  if (discounttype === "%") {
    const value = getFloatValue(discountValue);
    if (!isNaN(value)) {
      discountAmount = getFloatValue((rate * value) / 100);
      // discountAmount = discountAmount * qnt;
    }
  } else {
    if (!isNaN(discountValue)) {
      if (isGlobal) {
        //CHANGE - 06-04-2021  - for fix discount issue

        // discountAmount = rate * qnt * discountValue / totalAmount;

        discountAmount = getFloatValue((rate * qnt) * getFloatValue(discountValue) / totalAmount);
        // const totalRate = getFloatValue(rate * qnt, fraxtionDigits);
        // const d = totalRate * getFloatValue(discountValue, fraxtionDigits);
        // const f = getFloatValue(d, fraxtionDigits);
        // const g = f / getFloatValue(totalAmount, fraxtionDigits);
        // discountAmount = getFloatValue(g, fraxtionDigits);

        // const totalRate = rate * qnt;
        // const f = totalRate * discountValue;
        // discountAmount = f / totalAmount;

      } else {
        discountAmount = discountValue;
      }
      discountAmount = discountAmount / qnt;
    }
  }
  return {
    discount: discountAmount,
    totaldiscount: discountAmount
  };

}

export const inclusiveTaxCalc = (taxGroupId: any, taxableValue: any, fraxtionDigits?: number) => {


  taxableValue = getFloatValue(taxableValue, fraxtionDigits);
  let inclusiveTaxRate = 0;
  const {tax}: any = localredux.initData;
  let productTaxGroup: any = Object.values(tax).find((tg: any) => tg.taxgroupid === taxGroupId);
  if (productTaxGroup?.taxes) {
    Object.values(productTaxGroup.taxes).forEach((t: any) => {
      const {taxpercentage} = t;
      inclusiveTaxRate += parseFloat(taxpercentage);
    });
  }

  let inclusive_formula = 1 + (inclusiveTaxRate / 100);
  taxableValue = getFloatValue(taxableValue / inclusive_formula, fraxtionDigits)
  return taxableValue;
}

export const taxCalc = (taxGroupId: any, taxableValue: any, qnt: any, vouchertaxtype: any, fraxtionDigits?: number, product_rate?: number) => {

  const {tax}: any = localredux.initData;
  let totalTax = 0, taxes: any = [], taxablerate = 0;
  let productTaxGroup: any = Object.values(tax).find((tg: any) => tg.taxgroupid === taxGroupId);
  if (Boolean(productTaxGroup)) {

    Object.values(productTaxGroup.taxes).forEach((t: any) => {
      const {taxid, taxname, taxpercentage, taxtype} = t;
      let taxpriceDisplay = taxpercentage * taxableValue;

      taxpriceDisplay = getFloatValue(taxpriceDisplay / 100);

      let taxprice = getFloatValue(taxpriceDisplay * qnt, 4);

      totalTax += getFloatValue(taxprice, fraxtionDigits);
      taxablerate = getFloatValue(taxableValue * qnt, fraxtionDigits);

      const itemTax = {
        taxgroupid: taxGroupId,
        taxid,
        taxname,
        taxpercentage,

        taxprice: getFloatValue(taxprice, fraxtionDigits),
        taxablerate,
        taxtype
      };
      taxes = [
        ...taxes,
        itemTax
      ];
    });
  }



  if (vouchertaxtype === "inclusive" && product_rate !== undefined) {
    let totalAfterTax = getFloatValue(taxablerate + totalTax, fraxtionDigits);
    let totalRateAmount = getFloatValue(product_rate * qnt, fraxtionDigits);


    if (totalAfterTax !== totalRateAmount) {
      let setTaxable = getFloatValue(totalRateAmount - totalAfterTax);
      taxablerate = getFloatValue(taxablerate + setTaxable, fraxtionDigits);
      taxableValue = taxablerate / qnt;

      taxes = taxes.map((tax: any) => {
        return {
          ...tax,
          taxablerate
        }
      })
    }
  }


  return {totalTax, taxes, taxableValue: taxableValue}
}
