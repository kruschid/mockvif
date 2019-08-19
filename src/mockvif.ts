import { text } from "body-parser";
import * as debug from "debug";
import * as express from "express";
import { readFileSync } from "fs";
import { Observable } from "rxjs";
import { parseString } from "xml2js";

const log = debug("MOCKVIF");

export const mockvif = (port: number): Observable<any> => {
  const app = express();
  app.use(text({type: "application/soap+xml"}))
  .use("/snapshot", (_, res) => {
    log("GET_SNAPSHOT");
    res.send(readFileSync("assets/snapshot.jpg"));
  })
  .use("/onvif", (req, res) => {
    parseString(req.body, (_, xml) => {
      const bodyFirstChild = xml["s:Envelope"]["s:Body"][0];
      const response = bodyFirstChild.GetSystemDateAndTime ? GetSystemDateAndTimeXML
        : bodyFirstChild.GetCapabilities ? GetCapabilitiesXML
        : bodyFirstChild.GetVideoSources ? GetVideoSourcesXML
        : bodyFirstChild.GetProfiles ? GetProfilesXML
        : bodyFirstChild.AbsoluteMove ? AbsoluteMoveXML
        : null;
      if (bodyFirstChild.AbsoluteMove) {
        const el = bodyFirstChild.AbsoluteMove[0].Position[0];
        const pos = {
          x: parseInt(el.PanTilt[0].$.x, 10),
          y: parseInt(el.PanTilt[0].$.y, 10),
          z: parseInt(el.Zoom[0].$.x, 10),
        };
        log(`ABSOLUTE_MOVE ${pos}`);
      }
      res.send(response);
    });
  });

  return Observable.create(() => {
      const server = app.listen(port, () =>
        // tslint:disable-next-line:no-console
        log(`mockvif is listening to ${port}`),
      );
      return () => {
        // tslint:disable-next-line:no-console
        log(`mockvif has stopped listening to ${port}`),
        server.close();
      };
    });
};

// tslint:disable:max-line-length
const GetSystemDateAndTimeXML = `
<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope" xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:chan="http://schemas.microsoft.com/ws/2005/02/duplex" xmlns:wsa5="http://www.w3.org/2005/08/addressing" xmlns:c14n="http://www.w3.org/2001/10/xml-exc-c14n#" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" xmlns:wsc="http://schemas.xmlsoap.org/ws/2005/02/sc" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:xmime5="http://www.w3.org/2005/05/xmlmime" xmlns:xmime="http://tempuri.org/xmime.xsd" xmlns:xop="http://www.w3.org/2004/08/xop/include" xmlns:tt="http://www.onvif.org/ver10/schema" xmlns:wsrfbf="http://docs.oasis-open.org/wsrf/bf-2" xmlns:wstop="http://docs.oasis-open.org/wsn/t-1" xmlns:wsrfr="http://docs.oasis-open.org/wsrf/r-2" xmlns:tds="http://www.onvif.org/ver10/device/wsdl" xmlns:tev="http://www.onvif.org/ver10/events/wsdl" xmlns:wsnt="http://docs.oasis-open.org/wsn/b-2" xmlns:tptz="http://www.onvif.org/ver20/ptz/wsdl" xmlns:trt="http://www.onvif.org/ver10/media/wsdl" xmlns:timg="http://www.onvif.org/ver20/imaging/wsdl" xmlns:tmd="http://www.onvif.org/ver10/deviceIO/wsdl" xmlns:tns1="http://www.onvif.org/ver10/topics" xmlns:ter="http://www.onvif.org/ver10/error" xmlns:tnsaxis="http://www.axis.com/2009/event/topics">
  <SOAP-ENV:Body>
    <tds:GetSystemDateAndTimeResponse>
      <tds:SystemDateAndTime>
        <tt:DateTimeType>Manual</tt:DateTimeType>
        <tt:DaylightSavings>true</tt:DaylightSavings>
        <tt:TimeZone>
          <tt:TZ>MoroccoStandardTime0</tt:TZ>
        </tt:TimeZone>
        <tt:UTCDateTime>
          <tt:Time>
            <tt:Hour>19</tt:Hour>
            <tt:Minute>14</tt:Minute>
            <tt:Second>37</tt:Second>
          </tt:Time>
          <tt:Date>
            <tt:Year>2014</tt:Year>
            <tt:Month>12</tt:Month>
            <tt:Day>24</tt:Day>
          </tt:Date>
        </tt:UTCDateTime>
      </tds:SystemDateAndTime>
    </tds:GetSystemDateAndTimeResponse>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

const GetCapabilitiesXML = `
<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope" xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:chan="http://schemas.microsoft.com/ws/2005/02/duplex" xmlns:wsa5="http://www.w3.org/2005/08/addressing" xmlns:c14n="http://www.w3.org/2001/10/xml-exc-c14n#" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" xmlns:wsc="http://schemas.xmlsoap.org/ws/2005/02/sc" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:xmime5="http://www.w3.org/2005/05/xmlmime" xmlns:xmime="http://tempuri.org/xmime.xsd" xmlns:xop="http://www.w3.org/2004/08/xop/include" xmlns:tt="http://www.onvif.org/ver10/schema" xmlns:wsrfbf="http://docs.oasis-open.org/wsrf/bf-2" xmlns:wstop="http://docs.oasis-open.org/wsn/t-1" xmlns:wsrfr="http://docs.oasis-open.org/wsrf/r-2" xmlns:tds="http://www.onvif.org/ver10/device/wsdl" xmlns:tev="http://www.onvif.org/ver10/events/wsdl" xmlns:wsnt="http://docs.oasis-open.org/wsn/b-2" xmlns:tptz="http://www.onvif.org/ver20/ptz/wsdl" xmlns:trt="http://www.onvif.org/ver10/media/wsdl" xmlns:timg="http://www.onvif.org/ver20/imaging/wsdl" xmlns:tmd="http://www.onvif.org/ver10/deviceIO/wsdl" xmlns:tns1="http://www.onvif.org/ver10/topics" xmlns:ter="http://www.onvif.org/ver10/error" xmlns:tnsaxis="http://www.axis.com/2009/event/topics">
  <SOAP-ENV:Header>
    <wsse:Security>
      <wsse:UsernameToken>
        <wsse:Username>admin</wsse:Username>
        <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">5y9Zcgk2iMChJdQw/yOKEtqsI/0=</wsse:Password>
        <wsse:Nonce>Nzg1MDE2OTYz</wsse:Nonce>
        <wsu:Created>2014-12-24T16:20:37.475Z</wsu:Created>
      </wsse:UsernameToken>
    </wsse:Security>
  </SOAP-ENV:Header>
  <SOAP-ENV:Body>
    <tds:GetCapabilitiesResponse>
      <tds:Capabilities>
        <tt:Device>
          <tt:XAddr>http://192.168.68.111/onvif/services</tt:XAddr>
          <tt:Network>
            <tt:IPFilter>false</tt:IPFilter>
            <tt:ZeroConfiguration>true</tt:ZeroConfiguration>
            <tt:IPVersion6>false</tt:IPVersion6>
            <tt:DynDNS>false</tt:DynDNS>
          </tt:Network>
          <tt:System>
            <tt:DiscoveryResolve>false</tt:DiscoveryResolve>
            <tt:DiscoveryBye>false</tt:DiscoveryBye>
            <tt:RemoteDiscovery>false</tt:RemoteDiscovery>
            <tt:SystemBackup>false</tt:SystemBackup>
            <tt:SystemLogging>false</tt:SystemLogging>
            <tt:FirmwareUpgrade>false</tt:FirmwareUpgrade>
            <tt:SupportedVersions>
              <tt:Major>2</tt:Major>
              <tt:Minor>40</tt:Minor>
            </tt:SupportedVersions>
          </tt:System>
          <tt:IO>
            <tt:InputConnectors>1</tt:InputConnectors>
            <tt:RelayOutputs>1</tt:RelayOutputs>
          </tt:IO>
          <tt:Security>
            <tt:TLS1.1>true</tt:TLS1.1>
            <tt:TLS1.2>false</tt:TLS1.2>
            <tt:OnboardKeyGeneration>false</tt:OnboardKeyGeneration>
            <tt:AccessPolicyConfig>false</tt:AccessPolicyConfig>
            <tt:X.509Token>false</tt:X.509Token>
            <tt:SAMLToken>false</tt:SAMLToken>
            <tt:KerberosToken>false</tt:KerberosToken>
            <tt:RELToken>false</tt:RELToken>
          </tt:Security>
        </tt:Device>
        <tt:Events>
          <tt:XAddr>http://192.168.68.111/onvif/services</tt:XAddr>
          <tt:WSSubscriptionPolicySupport>false</tt:WSSubscriptionPolicySupport>
          <tt:WSPullPointSupport>false</tt:WSPullPointSupport>
          <tt:WSPausableSubscriptionManagerInterfaceSupport>false</tt:WSPausableSubscriptionManagerInterfaceSupport>
        </tt:Events>
        <tt:Imaging>
          <tt:XAddr>http://192.168.68.111/onvif/services</tt:XAddr>
        </tt:Imaging>
        <tt:Media>
          <tt:XAddr>http://192.168.68.111/onvif/services</tt:XAddr>
          <tt:StreamingCapabilities>
            <tt:RTPMulticast>false</tt:RTPMulticast>
            <tt:RTP_TCP>true</tt:RTP_TCP>
            <tt:RTP_RTSP_TCP>true</tt:RTP_RTSP_TCP>
          </tt:StreamingCapabilities>
        </tt:Media>
        <tt:PTZ>
          <tt:XAddr>http://192.168.68.111/onvif/services</tt:XAddr>
        </tt:PTZ>
        <tt:Extension>
          <tt:DeviceIO>
            <tt:XAddr>http://192.168.68.111/onvif/services</tt:XAddr>
            <tt:VideoSources>1</tt:VideoSources>
            <tt:VideoOutputs>0</tt:VideoOutputs>
            <tt:AudioSources>1</tt:AudioSources>
            <tt:AudioOutputs>0</tt:AudioOutputs>
            <tt:RelayOutputs>1</tt:RelayOutputs>
          </tt:DeviceIO>
        </tt:Extension>
      </tds:Capabilities>
    </tds:GetCapabilitiesResponse>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

const GetVideoSourcesXML = `
<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope" xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:chan="http://schemas.microsoft.com/ws/2005/02/duplex" xmlns:wsa5="http://www.w3.org/2005/08/addressing" xmlns:c14n="http://www.w3.org/2001/10/xml-exc-c14n#" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" xmlns:wsc="http://schemas.xmlsoap.org/ws/2005/02/sc" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:xmime5="http://www.w3.org/2005/05/xmlmime" xmlns:xmime="http://tempuri.org/xmime.xsd" xmlns:xop="http://www.w3.org/2004/08/xop/include" xmlns:tt="http://www.onvif.org/ver10/schema" xmlns:wsrfbf="http://docs.oasis-open.org/wsrf/bf-2" xmlns:wstop="http://docs.oasis-open.org/wsn/t-1" xmlns:wsrfr="http://docs.oasis-open.org/wsrf/r-2" xmlns:tds="http://www.onvif.org/ver10/device/wsdl" xmlns:tev="http://www.onvif.org/ver10/events/wsdl" xmlns:wsnt="http://docs.oasis-open.org/wsn/b-2" xmlns:tptz="http://www.onvif.org/ver20/ptz/wsdl" xmlns:trt="http://www.onvif.org/ver10/media/wsdl" xmlns:timg="http://www.onvif.org/ver20/imaging/wsdl" xmlns:tmd="http://www.onvif.org/ver10/deviceIO/wsdl" xmlns:tns1="http://www.onvif.org/ver10/topics" xmlns:ter="http://www.onvif.org/ver10/error" xmlns:tnsaxis="http://www.axis.com/2009/event/topics">
  <SOAP-ENV:Header>
    <wsse:Security>
      <wsse:UsernameToken>
        <wsse:Username>admin</wsse:Username>
        <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">zrbiJA5e0IkzAeYHk/HAlTgBs9Q=</wsse:Password>
        <wsse:Nonce>NDU3MTE0NzM1OQ==</wsse:Nonce>
        <wsu:Created>2014-12-24T16:07:17.112Z</wsu:Created>
      </wsse:UsernameToken>
    </wsse:Security>
  </SOAP-ENV:Header>
  <SOAP-ENV:Body>
    <trt:GetVideoSourcesResponse>
      <trt:VideoSources token="vidsrc0">
        <tt:Framerate>30</tt:Framerate>
        <tt:Resolution>
          <tt:Width>1920</tt:Width>
          <tt:Height>1080</tt:Height>
        </tt:Resolution>
      </trt:VideoSources>
    </trt:GetVideoSourcesResponse>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
`;

const GetProfilesXML = `
<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope" xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:chan="http://schemas.microsoft.com/ws/2005/02/duplex" xmlns:wsa5="http://www.w3.org/2005/08/addressing" xmlns:c14n="http://www.w3.org/2001/10/xml-exc-c14n#" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" xmlns:wsc="http://schemas.xmlsoap.org/ws/2005/02/sc" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:xmime5="http://www.w3.org/2005/05/xmlmime" xmlns:xmime="http://tempuri.org/xmime.xsd" xmlns:xop="http://www.w3.org/2004/08/xop/include" xmlns:tt="http://www.onvif.org/ver10/schema" xmlns:wsrfbf="http://docs.oasis-open.org/wsrf/bf-2" xmlns:wstop="http://docs.oasis-open.org/wsn/t-1" xmlns:wsrfr="http://docs.oasis-open.org/wsrf/r-2" xmlns:tds="http://www.onvif.org/ver10/device/wsdl" xmlns:tev="http://www.onvif.org/ver10/events/wsdl" xmlns:wsnt="http://docs.oasis-open.org/wsn/b-2" xmlns:tptz="http://www.onvif.org/ver20/ptz/wsdl" xmlns:trt="http://www.onvif.org/ver10/media/wsdl" xmlns:timg="http://www.onvif.org/ver20/imaging/wsdl" xmlns:tmd="http://www.onvif.org/ver10/deviceIO/wsdl" xmlns:tns1="http://www.onvif.org/ver10/topics" xmlns:ter="http://www.onvif.org/ver10/error" xmlns:tnsaxis="http://www.axis.com/2009/event/topics">
  <SOAP-ENV:Header>
    <wsse:Security>
      <wsse:UsernameToken>
        <wsse:Username>admin</wsse:Username>
        <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">eqy980Ghbsq3pGRTc/9ogfBa/oA=</wsse:Password>
        <wsse:Nonce>NzQ2MTAxMDk3NQ==</wsse:Nonce>
        <wsu:Created>2014-12-24T16:20:37.481Z</wsu:Created>
      </wsse:UsernameToken>
    </wsse:Security>
  </SOAP-ENV:Header>
  <SOAP-ENV:Body>
    <trt:GetProfilesResponse>
      <trt:Profiles fixed="true" token="main">
        <tt:Name>main</tt:Name>
        <tt:VideoSourceConfiguration token="vscfg0">
          <tt:Name>vscfg0</tt:Name>
          <tt:UseCount>1</tt:UseCount>
          <tt:SourceToken>vidsrc0</tt:SourceToken>
          <tt:Bounds height="1080" width="1920" y="0" x="0"></tt:Bounds>
        </tt:VideoSourceConfiguration>
        <tt:VideoEncoderConfiguration token="main">
          <tt:Name>Main stream encoder</tt:Name>
          <tt:UseCount>1</tt:UseCount>
          <tt:Encoding>H264</tt:Encoding>
          <tt:Resolution>
            <tt:Width>1920</tt:Width>
            <tt:Height>1080</tt:Height>
          </tt:Resolution>
          <tt:Quality>8</tt:Quality>
          <tt:RateControl>
            <tt:FrameRateLimit>5</tt:FrameRateLimit>
            <tt:EncodingInterval>1</tt:EncodingInterval>
            <tt:BitrateLimit>1000</tt:BitrateLimit>
          </tt:RateControl>
          <tt:H264>
            <tt:GovLength>30</tt:GovLength>
            <tt:H264Profile>High</tt:H264Profile>
          </tt:H264>
          <tt:Multicast>
            <tt:Address>
              <tt:Type>IPv4</tt:Type>
              <tt:IPv4Address>0.0.0.0</tt:IPv4Address>
            </tt:Address>
            <tt:Port>0</tt:Port>
            <tt:TTL>0</tt:TTL>
            <tt:AutoStart>false</tt:AutoStart>
          </tt:Multicast>
          <tt:SessionTimeout>PT60S</tt:SessionTimeout>
        </tt:VideoEncoderConfiguration>
        <tt:PTZConfiguration token="default">
          <tt:Name>default</tt:Name>
          <tt:UseCount>1</tt:UseCount>
          <tt:NodeToken>default</tt:NodeToken>
          <tt:DefaultAbsolutePantTiltPositionSpace>http://www.onvif.org/ver10/tptz/PanTiltSpaces/PositionGenericSpace</tt:DefaultAbsolutePantTiltPositionSpace>
          <tt:DefaultAbsoluteZoomPositionSpace>http://www.onvif.org/ver10/tptz/ZoomSpaces/PositionGenericSpace</tt:DefaultAbsoluteZoomPositionSpace>
          <tt:DefaultRelativePanTiltTranslationSpace>http://www.onvif.org/ver10/tptz/PanTiltSpaces/TranslationGenericSpace</tt:DefaultRelativePanTiltTranslationSpace>
          <tt:DefaultRelativeZoomTranslationSpace>http://www.onvif.org/ver10/tptz/ZoomSpaces/TranslationGenericSpace</tt:DefaultRelativeZoomTranslationSpace>
          <tt:DefaultContinuousPanTiltVelocitySpace>http://www.onvif.org/ver10/tptz/PanTiltSpaces/VelocityGenericSpace</tt:DefaultContinuousPanTiltVelocitySpace>
          <tt:DefaultContinuousZoomVelocitySpace>http://www.onvif.org/ver10/tptz/ZoomSpaces/VelocityGenericSpace</tt:DefaultContinuousZoomVelocitySpace>
          <tt:DefaultPTZSpeed>
            <tt:PanTilt space="http://www.onvif.org/ver10/tptz/PanTiltSpaces/GenericSpeedSpace" y="1" x="1"></tt:PanTilt>
            <tt:Zoom space="http://www.onvif.org/ver10/tptz/ZoomSpaces/ZoomGenericSpeedSpace" x="1"></tt:Zoom>
          </tt:DefaultPTZSpeed>
          <tt:DefaultPTZTimeout>PT1093754.348S</tt:DefaultPTZTimeout>
        </tt:PTZConfiguration>
      </trt:Profiles>
    </trt:GetProfilesResponse>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
`;

const AbsoluteMoveXML = `
<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope" xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:chan="http://schemas.microsoft.com/ws/2005/02/duplex" xmlns:wsa5="http://www.w3.org/2005/08/addressing" xmlns:c14n="http://www.w3.org/2001/10/xml-exc-c14n#" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" xmlns:wsc="http://schemas.xmlsoap.org/ws/2005/02/sc" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:xmime5="http://www.w3.org/2005/05/xmlmime" xmlns:xmime="http://tempuri.org/xmime.xsd" xmlns:xop="http://www.w3.org/2004/08/xop/include" xmlns:tt="http://www.onvif.org/ver10/schema" xmlns:wsrfbf="http://docs.oasis-open.org/wsrf/bf-2" xmlns:wstop="http://docs.oasis-open.org/wsn/t-1" xmlns:wsrfr="http://docs.oasis-open.org/wsrf/r-2" xmlns:tds="http://www.onvif.org/ver10/device/wsdl" xmlns:tev="http://www.onvif.org/ver10/events/wsdl" xmlns:wsnt="http://docs.oasis-open.org/wsn/b-2" xmlns:tptz="http://www.onvif.org/ver20/ptz/wsdl" xmlns:trt="http://www.onvif.org/ver10/media/wsdl" xmlns:timg="http://www.onvif.org/ver20/imaging/wsdl" xmlns:tmd="http://www.onvif.org/ver10/deviceIO/wsdl" xmlns:tns1="http://www.onvif.org/ver10/topics" xmlns:ter="http://www.onvif.org/ver10/error" xmlns:tnsaxis="http://www.axis.com/2009/event/topics">
  <SOAP-ENV:Header>
    <wsse:Security>
      <wsse:UsernameToken>
        <wsse:Username>admin</wsse:Username>
        <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">XxKbln8Ajn9tM4/ikobaunLC1qc=</wsse:Password>
        <wsse:Nonce>NjYxNTE4MTk1OQ==</wsse:Nonce>
        <wsu:Created>2014-12-27T21:40:40.411Z</wsu:Created>
      </wsse:UsernameToken>
    </wsse:Security>
  </SOAP-ENV:Header>
  <SOAP-ENV:Body>
    <tptz:AbsoluteMoveResponse></tptz:AbsoluteMoveResponse>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
`;
