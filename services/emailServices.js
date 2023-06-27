const nodemailer = require('nodemailer');
const { MAIL_SETTINGS } = require('../config/mail');
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

const sendMail = async (params) => {
  try {
    transporter.verify(function (error, success) {
      if (error) {
        console.log('====>' + error);
      } else if (success) {
        console.log("Server is ready to take our messages");
      }
    });

    const mailData = {
      from: MAIL_SETTINGS.auth.user,
      to: params.to, // list of receivers
      subject: 'Your Sentra Hotel OTP Code ✔', // Subject line
      text: "text",
      html: `
      <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>Welcome Sentra Hotel.</h2>
        <h4>You are officially In ✔</h4>
        <p style="margin-bottom: 30px;">Please enter the sign up OTP to get started</p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
        <p style="margin-top:50px;">If you do not request for verification please do not respond to the mail. You can in turn un subscribe to the mailing list and we will never bother you again.</p>
      </div>
    `,
    };

    const bookingMail = {
      from: MAIL_SETTINGS.auth.user,
      to: params.to, // list of receivers
      subject: 'Sentra Hotel Booking Ref. ✔', // Subject line
      text: "text",
      html: `<HTML>
      <table border="0" cellspacing="0" cellpadding="0" width="610">
          <tbody>
              <tr>
                  <td>
                      <div style="text-align:left"><img src="https://sentra.hotelxml.com/azone/image/admin/bg_login.jpg" height="70"></div>
                  </td>
              </tr>
              <tr>
                  <td style="width:650px;height:35px;text-align:center;font-size:18px;line-height:200%;font-weight:bold">
                      <div style="width:650px;border-bottom:2px solid #000">Sentra Holidays</div>
                  </td>
              </tr>
              <tr>
                  <td align="center" style="width:610px;font-size:7pt;line-height:150%;text-align:center"><br>Tel : +6287722389541&nbsp;&nbsp;&nbsp;&nbsp;Fax : &nbsp;&nbsp;&nbsp;&nbsp;Email : <a href="mailto:reservation@sentraholidays.com" target="_blank">reservation@sentraholidays.com</a></td>
              </tr>
          </tbody>
      </table>
      
      <table width="610" height="30" border="0" cellpadding="0" cellspacing="0">
          <tbody>
              <tr>
                  <td style="font-weight:bold;color:#ff6204;font-size:25px;font-family:tahoma" align="center">
                      Cancel Request
                  </td>
              </tr>
          </tbody>
      </table>
      
      <br>
      
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
          <tbody>
              <tr height="10">
                  <td></td>
              </tr>
              <tr height="1">
                  <td bgcolor="#EDEDED"></td>
              </tr>
          </tbody>
      </table>
      
      <table width="610" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:15px">
          <tbody>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Status</td>
                  <td colspan="3" style="text-align:left;border-bottom:1px dotted #666;color:red">CANCELED</td>
              </tr>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Booking No.</td>
                  <td colspan="3" style="text-align:left;border-bottom:1px dotted #666;color:red">SEC180001423&nbsp;/&nbsp;SEC180001423</td>
              </tr>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Travel Agent</td>
                  <td colspan="3" width="490" style="text-align:left;border-bottom:1px dotted #666">&nbsp;AGUNG TRAVEL(AGUNG TRAVEL)</td>
              </tr>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Address</td>
                  <td colspan="3" width="490" style="text-align:left;border-bottom:1px dotted #666"> Jl. Raya Kebayoran Lama No. 123, Jakarta</td>
              </tr>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Contact Person</td>
                  <td width="160" style="text-align:left;border-bottom:1px dotted #666"> John Doe</td>
                  <td width="100" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Phone</td>
                  <td width="230" style="text-align:left;border-bottom:1px dotted #666"> +628123456789</td>
              </tr>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Email</td>
                  <td colspan="3" style="text-align:left;border-bottom:1px dotted #666"> john.doe@example.com</td>
              </tr>
          </tbody>
      
      </table>
      <table width="610" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:15px">
          <tbody>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Hotel Name</td>
                  <td colspan="3" width="490" style="text-align:left;border-bottom:1px dotted #666">&nbsp;Hotel ABC</td>
              </tr>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Check-in Date</td>
                  <td width="160" style="text-align:left;border-bottom:1px dotted #666">&nbsp;2023-03-15</td>
                  <td width="100" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Check-out Date</td>
                  <td width="230" style="text-align:left;border-bottom:1px dotted #666">&nbsp;2023-03-20</td>
              </tr>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Room Type</td>
                  <td colspan="3" style="text-align:left;border-bottom:1px dotted #666">&nbsp;Deluxe Room</td>
              </tr>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Room Quantity</td>
                  <td colspan="3" style="text-align:left;border-bottom:1px dotted #666">&nbsp;2</td>
              </tr>
          </tbody>
      </table>
      <table width="610" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:15px">
          <tbody>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Total Amount</td>
                  <td colspan="3" width="490" style="text-align:left;border-bottom:1px dotted #666">&nbsp;IDR 5,000,000.00</td>
              </tr>
          </tbody>
      </table>
      
      <table width="608" border="0" cellpadding="0" cellspacing="0">
          <tbody>
              <tr height="30">
                  <td style="font-size:12px; text-align:right;">( Currency: IDR )</td>
              </tr>
          </tbody>
      </table>
      
      <table width="610" border="0" cellpadding="0" cellspacing="1" bgcolor="#B7DBF2">
          <tbody>
              <tr>
                  <td bgcolor="#FFFFFF">
      
                      <table width="608" border="0" cellpadding="0" cellspacing="0">
                          <tbody>
                              <tr height="30">
                                  <td width="25%" align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td" rowspan="2">City/Hotel</td>
                                  <td width="10%" align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l" rowspan="2">Check-in<br>Check-out</td>
                                  <td width="5%" align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l" rowspan="2">Ngt</td>
                                  <td width="5%" align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l" rowspan="2">SGL</td>
                                  <td width="5%" align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l" rowspan="2">TWN</td>
                                  <td width="5%" align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l" rowspan="2">DBL</td>
                                  <td width="5%" align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l" rowspan="2">TRP</td>
                                  <td width="5%" align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l" rowspan="2">QUAD</td>
                                  <td width="184" align="center" style="font-family:tahoma; font-size:12px; color:#0970b0" class="td_l" colspan="6">Price</td>
                              </tr>
                              <tr height="30">
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l">SGL</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l">TWN</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l">DBL</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l">TRP</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l">QUAD</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l">Total</td>
                              </tr>
      
                              <tr height="30">
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td">Bandung / <br>
                                      <b>Favehotel Hyper Square Bandung
                  &nbsp;
            </b></td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">2023-08-01<br>2023-08-02</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">1</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">1</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">395,000</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">395,000</td>
                              </tr>
                              <tr height="30">
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td" colspan="2"><b>Total</b></td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">1</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">1</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">395,000</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">395,000</td>
                              </tr>
      
                          </tbody>
                      </table>
      </table>
      <p style="margin-bottom:15px">Please let us know if you have any further questions or require any assistance. We look forward to welcoming you to Hotel ABC.</p>
      <p style="margin-bottom:15px">Best regards,</p>
      <p style="margin-bottom:15px">John Doe</p>
      <p style="margin-bottom:15px">Hotel ABC</p>
      <p style="margin-bottom:15px">Note: This is an auto-generated email. Please do not reply.</p>
      </body>
      
      </html>
      
      </HTML>
      `
    }
    const mailDataWithAttachment = {
      from: 'youremail@gmail.com',
      to: to,
      subject: subject,
      text: text,
      html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
      attachments: [
        {   // file on disk as an attachment
          filename: 'nodemailer.png',
          path: 'nodemailer.png'
        },
        {   // file on disk as an attachment
          filename: 'text_file.txt',
          path: 'text_file.txt'
        }
      ]
    };

    let info = transporter.sendMail(mailData, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log(info)
    });

    return info;
  } catch (error) {

    return false;
  }
};

const sendBookMail = async (params) => {
  try {
    transporter.verify(function (error, success) {
      if (error) {
        console.log('====>' + error);
      } else if (success) {
        console.log("Server is ready to take our messages");
      }
    });   

    const bookingMail = {
      from: MAIL_SETTINGS.auth.user,
      to: params.to, // list of receivers
      subject: 'Sentra Hotel Booking Ref. ✔', // Subject line
      text: "text",
      html: `<HTML>
      <table border="0" cellspacing="0" cellpadding="0" width="610">
          <tbody>
              <tr>
                  <td>
                      <div style="text-align:left"><img src="https://sentra.hotelxml.com/azone/image/admin/bg_login.jpg" height="70"></div>
                  </td>
              </tr>
              <tr>
                  <td style="width:650px;height:35px;text-align:center;font-size:18px;line-height:200%;font-weight:bold">
                      <div style="width:650px;border-bottom:2px solid #000">Sentra Holidays</div>
                  </td>
              </tr>
              <tr>
                  <td align="center" style="width:610px;font-size:7pt;line-height:150%;text-align:center"><br>Tel : +6287722389541&nbsp;&nbsp;&nbsp;&nbsp;Fax : &nbsp;&nbsp;&nbsp;&nbsp;Email : <a href="mailto:reservation@sentraholidays.com" target="_blank">reservation@sentraholidays.com</a></td>
              </tr>
          </tbody>
      </table>
      
      <table width="610" height="30" border="0" cellpadding="0" cellspacing="0">
          <tbody>
              <tr>
                  <td style="font-weight:bold;color:#ff6204;font-size:25px;font-family:tahoma" align="center">
                      Cancel Request
                  </td>
              </tr>
          </tbody>
      </table>
      
      <br>
      
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
          <tbody>
              <tr height="10">
                  <td></td>
              </tr>
              <tr height="1">
                  <td bgcolor="#EDEDED"></td>
              </tr>
          </tbody>
      </table>
      
      <table width="610" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:15px">
          <tbody>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Status</td>
                  <td colspan="3" style="text-align:left;border-bottom:1px dotted #666;color:red">CANCELED</td>
              </tr>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Booking No.</td>
                  <td colspan="3" style="text-align:left;border-bottom:1px dotted #666;color:red">SEC180001423&nbsp;/&nbsp;SEC180001423</td>
              </tr>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Travel Agent</td>
                  <td colspan="3" width="490" style="text-align:left;border-bottom:1px dotted #666">&nbsp;AGUNG TRAVEL(AGUNG TRAVEL)</td>
              </tr>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Address</td>
                  <td colspan="3" width="490" style="text-align:left;border-bottom:1px dotted #666"> Jl. Raya Kebayoran Lama No. 123, Jakarta</td>
              </tr>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Contact Person</td>
                  <td width="160" style="text-align:left;border-bottom:1px dotted #666"> John Doe</td>
                  <td width="100" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Phone</td>
                  <td width="230" style="text-align:left;border-bottom:1px dotted #666"> +628123456789</td>
              </tr>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Email</td>
                  <td colspan="3" style="text-align:left;border-bottom:1px dotted #666"> john.doe@example.com</td>
              </tr>
          </tbody>
      
      </table>
      <table width="610" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:15px">
          <tbody>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Hotel Name</td>
                  <td colspan="3" width="490" style="text-align:left;border-bottom:1px dotted #666">&nbsp;Hotel ABC</td>
              </tr>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Check-in Date</td>
                  <td width="160" style="text-align:left;border-bottom:1px dotted #666">&nbsp;2023-03-15</td>
                  <td width="100" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Check-out Date</td>
                  <td width="230" style="text-align:left;border-bottom:1px dotted #666">&nbsp;2023-03-20</td>
              </tr>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Room Type</td>
                  <td colspan="3" style="text-align:left;border-bottom:1px dotted #666">&nbsp;Deluxe Room</td>
              </tr>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Room Quantity</td>
                  <td colspan="3" style="text-align:left;border-bottom:1px dotted #666">&nbsp;2</td>
              </tr>
          </tbody>
      </table>
      <table width="610" border="0" cellpadding="0" cellspacing="0" style="margin-bottom:15px">
          <tbody>
              <tr height="30">
                  <td width="120" style="color:#888;font-weight:bold;padding:0 15px 0 0;text-align:right;border-bottom:1px dotted #666">Total Amount</td>
                  <td colspan="3" width="490" style="text-align:left;border-bottom:1px dotted #666">&nbsp;IDR 5,000,000.00</td>
              </tr>
          </tbody>
      </table>
      
      <table width="608" border="0" cellpadding="0" cellspacing="0">
          <tbody>
              <tr height="30">
                  <td style="font-size:12px; text-align:right;">( Currency: IDR )</td>
              </tr>
          </tbody>
      </table>
      
      <table width="610" border="0" cellpadding="0" cellspacing="1" bgcolor="#B7DBF2">
          <tbody>
              <tr>
                  <td bgcolor="#FFFFFF">
      
                      <table width="608" border="0" cellpadding="0" cellspacing="0">
                          <tbody>
                              <tr height="30">
                                  <td width="25%" align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td" rowspan="2">City/Hotel</td>
                                  <td width="10%" align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l" rowspan="2">Check-in<br>Check-out</td>
                                  <td width="5%" align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l" rowspan="2">Ngt</td>
                                  <td width="5%" align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l" rowspan="2">SGL</td>
                                  <td width="5%" align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l" rowspan="2">TWN</td>
                                  <td width="5%" align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l" rowspan="2">DBL</td>
                                  <td width="5%" align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l" rowspan="2">TRP</td>
                                  <td width="5%" align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l" rowspan="2">QUAD</td>
                                  <td width="184" align="center" style="font-family:tahoma; font-size:12px; color:#0970b0" class="td_l" colspan="6">Price</td>
                              </tr>
                              <tr height="30">
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l">SGL</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l">TWN</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l">DBL</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l">TRP</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l">QUAD</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#0970b0" class="td_l">Total</td>
                              </tr>
      
                              <tr height="30">
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td">Bandung / <br>
                                      <b>Favehotel Hyper Square Bandung
                  &nbsp;
            </b></td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">2023-08-01<br>2023-08-02</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">1</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">1</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">395,000</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td_l">395,000</td>
                              </tr>
                              <tr height="30">
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF;" class="td" colspan="2"><b>Total</b></td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">1</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">1</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">395,000</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">-</td>
                                  <td align="center" style="font-family:tahoma; font-size:11px; color:#000; background-color:#FFFFFF; font-weight:bold;" class="td_l">395,000</td>
                              </tr>
      
                          </tbody>
                      </table>
      </table>
      <p style="margin-bottom:15px">Please let us know if you have any further questions or require any assistance. We look forward to welcoming you to Hotel ABC.</p>
      <p style="margin-bottom:15px">Best regards,</p>
      <p style="margin-bottom:15px">John Doe</p>
      <p style="margin-bottom:15px">Hotel ABC</p>
      <p style="margin-bottom:15px">Note: This is an auto-generated email. Please do not reply.</p>
      </body>
      
      </html>
      
      </HTML>
      `
    }

    const mailDataWithAttachment = {
      from: 'youremail@gmail.com',
      to: to,
      subject: subject,
      text: text,
      html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
      attachments: [
        {   // file on disk as an attachment
          filename: 'nodemailer.png',
          path: 'nodemailer.png'
        },
        {   // file on disk as an attachment
          filename: 'text_file.txt',
          path: 'text_file.txt'
        }
      ]
    };

    let info = transporter.sendBookMail(bookingMail, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log(info)
    });

    return info;
  } catch (error) {

    return false;
  }
};


module.exports = {
  sendMail,
  sendBookMail
}