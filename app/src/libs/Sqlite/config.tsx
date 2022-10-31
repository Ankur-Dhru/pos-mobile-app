
export enum TABLE {
  DATA = "tblData",
  ITEM = "tblItem",
  CLIENT = "tblClient",
  ORDER = "tblOrder",
}

export const CREATE_CLIENT_TABLE = `create table if not exists ${TABLE.CLIENT}
                                    (
                                      clientid    int  not null primary key,
                                      displayname TEXT  null,
                                      phone       TEXT   null,
                                      data        TEXT          null,
                                      taxregtype  TEXT   null,
                                      clienttype  int default 0 null
                                    );`;


export const CREATE_ITEM_TABLE = `create table if not exists ${TABLE.ITEM}
(
  itemid            INT not null
  primary key,
  itemname          TEXT,
  itemgroupid       TEXT,
  uniqueproductcode TEXT,
  data              TEXT,
  itemstatus        TEXT,
  pricealert        tinyint(1) default 0
);`;


export const CREATE_ITEM_INDEX_ITEMGROUPID = `create index index_itemgroupid on ${TABLE.ITEM} (itemgroupid);`;
export const CREATE_ITEM_INDEX_ITEMNAME = `create index index_itemname on ${TABLE.ITEM} (itemname);`;
export const CREATE_ITEM_INDEX_ITEMUNIQUE = `create index index_itemuniquecode on ${TABLE.ITEM} (uniqueproductcode);`;




/*export const CREATE_DATA_TABLE = `create table if not exists  ${TABLE.DATA}
(
    \`key\` varchar(20) not null,
    data  blob        not null,
);`;*/


export const CREATE_ORDER_TABLE = `create table if not exists ${TABLE.ORDER}
(
  localorderid           int auto_increment
  primary key,
  invoice_display_number int                          null,
  orderid                varchar(50)                  null,
  datetime               datetime                     null,
  vouchertypeid          varchar(100)                 null,
  paymentmethod          varchar(50)                  null,
  clientid               int                          null,
  staffid                int            default 0     null,
  vouchertotaldisplay    decimal(20, 3) default 0.000 null,
  data                   json                         null,
  syncstatus             tinyint(1)     default 0     null
);`;




