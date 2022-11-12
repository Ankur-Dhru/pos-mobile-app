export enum Templates {
    PNG_IMAGE = 'PNG_IMAGE',
    BASIC = 'BASIC',
    QR_CODE = 'QR_CODE',
    BAR_CODE = 'BAR_CODE',
    TABLE = 'TABLE',
}

export const TEMPLATES = {
    [Templates.BASIC]: `<?xml version="1.0" encoding="UTF-8"?>
  <document>
      <line-feed />
      <align mode="center">
          <bold>
              <text-line size="1:1">{{title}}</text-line>
          </bold>
          <line-feed />
          <small>
              <text-line>{{subtitle}}</text-line>
          </small>
      </align>
      <small>
          <text-line>Date: {{moment date format="DD/MM/YYYY HH:mm:ss"}}</text-line>
          <text-line size="1:0">{{numeral price format="$ 0,0.00"}}</text-line>
          <text-line size="1:0">{{paddedString}}</text-line>
      </small>
      <line-feed />
      <underline>
        <text-line>{{underline}}</text-line>
      </underline>
      <line-feed />
      <align mode="center">
          <white-mode>
              <text-line size="1:1">{{description}}</text-line>
          </white-mode>
          <line-feed />
           
      </align>
      <line-feed />
      <align mode="center">
          <barcode system="CODE_128" width="DOT_250">{{barcode}}</barcode>
      </align>
      <line-feed />
      <align mode="center">
          <qrcode ecl="M">{{qrcode}}</qrcode>
      </align>
    <paper-cut/>
  </document>`,
    [Templates.PNG_IMAGE]: `
  <?xml version="1.0" encoding="UTF-8"?>
  <document>
    <align mode="center">
      <bold>
        <text-line size="1:0">{{title}}</text-line>
      </bold>

      <image density="d24">
        {{logo}}
      </image>
    </align>
  </document>`,
    [Templates.QR_CODE]: `
  <?xml version="1.0" encoding="UTF-8"?>
  <document>
    <align mode="center">
      <qrcode ecl="M">{{qrcode}}</qrcode>
    </align>
    <line-feed/>
    <paper-cut/>
  </document>
  `,
    [Templates.BAR_CODE]: `
  <?xml version="1.0" encoding="UTF-8"?>
  <document>
    <line-feed />
    <align mode="center">
      <barcode system="CODE_128" width="DOT_250">{{barcode}}</barcode>
    </align>
    <line-feed />
    <paper-cut/>
  </document>`,
    [Templates.TABLE]: `<?xml version="1.0" encoding="UTF-8"?>
  <document>
    <line-feed />
    <text-line>{{tableData}}</text-line>
    <paper-cut/>
  </document>`,
}
