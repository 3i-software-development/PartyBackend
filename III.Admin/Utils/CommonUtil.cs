using System;
using System.Collections.Generic;
using System.Linq;
using ESEIM.Models;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using MimeKit;
using MailKit.Net.Smtp;
using System.Reflection;
using System.ComponentModel;
using System.Globalization;
using MailKit.Security;
using QRCoder;
using System.IO;
using System.Drawing.Imaging;
using System.Drawing;
using System.Drawing.Drawing2D;
using GeoCoordinatePortable;
using System.Data;
using System.Data.SqlClient;
//using Net.ConnectCode.Barcode;
//using static III.Admin.Controllers.DistanceMatrixResponse;
using ZXing;
using System.Threading.Tasks;
using System.Net;
using System.Net.Http;
using Microsoft.Extensions.Configuration;
using MailKit.Net.Pop3;
using MailKit;
using System.Text.RegularExpressions;
using System.Text;
using RestSharp;
using MimeKit.Text;

namespace ESEIM.Utils
{
    public static class CommonUtil
    {
        public static List<AdLanguage> Languages { get; set; }
        public static AdLanguage CurrentLanguage { get; set; }
        public static JObject Resource { get; set; }
        public static string ResourceValue(string caption)
        {
            try
            {
                return Resource[caption].HasValues ? caption : Resource[caption].Value<string>();
            }
            catch (Exception)
            {
                return caption;
            }
        }
        private static string GoogleDistanceMatrixKey = "AIzaSyCCNEyZzoebk3a7IT4HZth3j1CLR-PXEgg";

        public static SessionUserLogin GetSessionUser(this HttpContext context)
        {
            SessionUserLogin session = null;
            if (context.Session.IsExists("E_SESSION_USER"))
            {
                session = context.Session.Get<SessionUserLogin>("E_SESSION_USER");
            }
            return session;
        }

        public static string DescriptionAttr<T>(this T source)
        {
            FieldInfo fi = source.GetType().GetField(source.ToString());

            DescriptionAttribute[] attributes = (DescriptionAttribute[])fi.GetCustomAttributes(
                typeof(DescriptionAttribute), false);

            if (attributes != null && attributes.Length > 0) return attributes[0].Description;
            else return source.ToString();
        }

        public static void SetSessionUser(this HttpContext context, SessionUserLogin session)
        {
            context.Session.Set("E_SESSION_USER", session);
        }

        public static T Clone<T>(T source)
        {
            var serialized = JsonConvert.SerializeObject(source);
            return JsonConvert.DeserializeObject<T>(serialized);
        }

        public static string GenerateOTP(int length = 4, bool onlyNumber = true)
        {
            string alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            string small_alphabets = "abcdefghijklmnopqrstuvwxyz";
            string numbers = "1234567890";

            string characters = numbers;
            if (!onlyNumber)
            {
                characters += alphabets + small_alphabets + numbers;
            }
            string otp = string.Empty;
            for (int i = 0; i < length; i++)
            {
                string character;
                do
                {
                    int index = new Random().Next(0, characters.Length);
                    character = characters.ToCharArray()[index].ToString();
                } while (otp.IndexOf(character, StringComparison.Ordinal) != -1);
                otp += character;
            }

            return otp;
        }

        public static JMessage SendMail(string from, string to, string title, string content, string host, int port, string userName, string passWord,
            TextFormat format = TextFormat.Text)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(from));
                message.To.Add(new MailboxAddress(to));
                message.Subject = title;
                message.Body = new TextPart(format)
                {
                    Text = content,
                };
                using (var client = new SmtpClient())
                {
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                    client.Connect(host, port, SecureSocketOptions.Auto);
                    client.Authenticate(userName, passWord);
                    client.Send(message);
                    client.Disconnect(true);
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = ex.Message;
            }
            return msg;
        }

        public static JMessage SendMailHtml(string from, string to, string title, string content, string host, int port, string userName, string passWord)
        {
            var msg = new JMessage { Error = false, Title = "" };
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(from));
                message.To.Add(new MailboxAddress(to));
                message.Subject = title;
                var builder = new BodyBuilder();
                builder.HtmlBody = content;
                message.Body = builder.ToMessageBody();
                using (var client = new SmtpClient())
                {
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                    client.Connect(host, port, SecureSocketOptions.Auto);
                    client.Authenticate(userName, passWord);
                    client.Send(message);
                    client.Disconnect(true);
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = ex.Message;
            }
            return msg;
        }

        public static JMessage ReceiveEmail(string userName, string passWord)
        {
            var msg = new JMessage();
            List<EmailMessage> emails = new List<EmailMessage>();
            try
            {
                using (var emailClient = new Pop3Client())
                {
                    emailClient.ServerCertificateValidationCallback = (s, c, h, e) => true;
                    emailClient.Connect("mail.3i.com.vn", 995, SecureSocketOptions.Auto);

                    emailClient.AuthenticationMechanisms.Remove("XOAUTH2");

                    emailClient.Authenticate(userName, passWord);

                    for (int i = 0; i < emailClient.Count; i++)
                    {
                        var message = emailClient.GetMessage(i);
                        var emailMessage = new EmailMessage
                        {
                            Content = !string.IsNullOrEmpty(message.HtmlBody) ? message.HtmlBody : message.TextBody,
                            Subject = message.Subject
                        };
                        emailMessage.ToAddresses.AddRange(message.To.Select(x => (MailboxAddress)x).Select(x => new EmailAddress { Address = x.Address, Name = x.Name }));
                        emailMessage.FromAddresses.AddRange(message.From.Select(x => (MailboxAddress)x).Select(x => new EmailAddress { Address = x.Address, Name = x.Name }));
                        emails.Add(emailMessage);
                    }
                    msg.Object = emails;
                }
            }
            catch (Exception ex)
            {
                msg.Error = true;
                msg.Title = ex.Message;
            }
            return msg;
        }

        public class EmailMessage
        {
            public EmailMessage()
            {
                ToAddresses = new List<EmailAddress>();
                FromAddresses = new List<EmailAddress>();
            }

            public List<EmailAddress> ToAddresses { get; set; }
            public List<EmailAddress> FromAddresses { get; set; }
            public string Subject { get; set; }
            public string Content { get; set; }
        }
        public class EmailAddress
        {
            public string Name { get; set; }
            public string Address { get; set; }
        }

        public static int GetIso8601WeekOfYear(DateTime time)
        {
            DayOfWeek day = CultureInfo.InvariantCulture.Calendar.GetDayOfWeek(time);
            if (day >= DayOfWeek.Monday && day <= DayOfWeek.Wednesday)
            {
                time = time.AddDays(3);
            }

            return CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(time, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
        }

        public static string JsonData(object oldEntry, object newEntry, string jsonData, string updatedBy)
        {
            var jsonRs = string.Empty;
            try
            {
                var logChanges = GetChanges(oldEntry, newEntry, updatedBy);

                if (!string.IsNullOrEmpty(jsonData))
                {
                    var listLog = JsonConvert.DeserializeObject<List<ChangeLog>>(jsonData);
                    if (listLog.Count > 0 || logChanges.Count > 0)
                    {
                        listLog.AddRange(logChanges);
                        jsonRs = JsonConvert.SerializeObject(listLog);
                    }
                }
                else
                {
                    if (logChanges.Count > 0)
                    {
                        jsonRs = JsonConvert.SerializeObject(logChanges);
                    }
                }
            }
            catch (Exception ex)
            {

            }

            return jsonRs;
        }

        public static List<ChangeLog> GetChanges(object oldEntry, object newEntry, string updatedBy)
        {
            List<ChangeLog> logs = new List<ChangeLog>();

            var oldType = oldEntry.GetType();
            var newType = newEntry.GetType();
            if (oldType != newType)
            {
                return logs; //Types don't match, cannot log changes
            }

            var oldProperties = oldType.GetProperties();
            var newProperties = newType.GetProperties();

            var dateChanged = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
            var className = oldEntry.GetType().Name;
            string[] fieldNotLogs = { "StatusLog", "JsonData", "CreatedBy", "CreatedTime", "UpdatedBy", "UpdatedTime" };

            foreach (var oldProperty in oldProperties)
            {
                if (fieldNotLogs.Any(x => x.Equals(oldProperty.Name)))
                {
                    continue;
                }

                var matchingProperty = newProperties.Where(x => !Attribute.IsDefined(x, typeof(Attribute))
                                                                && x.Name == oldProperty.Name
                                                                && x.PropertyType == oldProperty.PropertyType).FirstOrDefault();
                if (matchingProperty == null)
                {
                    continue;
                }
                var oldValue = oldProperty.GetValue(oldEntry) != null ? oldProperty.GetValue(oldEntry).ToString() : "";
                var newValue = matchingProperty.GetValue(newEntry) != null ? matchingProperty.GetValue(newEntry).ToString() : "";
                if (matchingProperty != null && oldValue != newValue)
                {
                    logs.Add(new ChangeLog()
                    {
                        DateChanged = dateChanged,
                        ClassName = className,
                        PropertyName = matchingProperty.Name,
                        OldValue = oldValue,
                        NewValue = newValue,
                        UpdatedBy = updatedBy
                    });
                }
            }

            return logs;
        }

        public class ChangeLog
        {
            public string ClassName { get; set; }
            public string PropertyName { get; set; }
            public string OldValue { get; set; }
            public string NewValue { get; set; }
            public string DateChanged { get; set; }
            public string UpdatedBy { get; set; }
        }

        public static int GetWeekOfYear(DateTime time)
        {
            // Seriously cheat.  If its Monday, Tuesday or Wednesday, then it'll 
            // be the same week# as whatever Thursday, Friday or Saturday are,
            // and we always get those right
            DayOfWeek day = CultureInfo.InvariantCulture.Calendar.GetDayOfWeek(time);
            if (day >= DayOfWeek.Monday && day <= DayOfWeek.Wednesday)
            {
                time = time.AddDays(3);
            }

            // Return the week of our adjusted day
            return CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(time, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
        }

        public static DateTime FirstDateOfWeekISO8601(int year, int weekOfYear)
        {
            DateTime jan1 = new DateTime(year, 1, 1);
            int daysOffset = DayOfWeek.Thursday - jan1.DayOfWeek;

            // Use first Thursday in January to get first week of the year as
            // it will never be in Week 52/53
            DateTime firstThursday = jan1.AddDays(daysOffset);
            var cal = CultureInfo.CurrentCulture.Calendar;
            int firstWeek = cal.GetWeekOfYear(firstThursday, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);

            var weekNum = weekOfYear;
            // As we're adding days to a date in Week 1,
            // we need to subtract 1 in order to get the right date for week #1
            if (firstWeek == 1)
            {
                weekNum -= 1;
            }

            // Using the first Thursday as starting week ensures that we are starting in the right year
            // then we add number of weeks multiplied with days
            var result = firstThursday.AddDays(weekNum * 7);

            // Subtract 3 days from Thursday to get Monday, which is the first weekday in ISO8601
            return result.AddDays(-3);
        }
        public static string GetGoogleDistanceMatrixKey()
        {
            return GoogleDistanceMatrixKey;
        }
        public static GeoCoordinate GetCentralGeoCoordinate(List<GeoCoordinate> geoCoordinates)
        {
            if (geoCoordinates.Count == 1)
            {
                return geoCoordinates.Single();
            }

            double x = 0;
            double y = 0;
            double z = 0;

            foreach (var geoCoordinate in geoCoordinates)
            {
                var latitude = geoCoordinate.Latitude * Math.PI / 180;
                var longitude = geoCoordinate.Longitude * Math.PI / 180;

                x += Math.Cos(latitude) * Math.Cos(longitude);
                y += Math.Cos(latitude) * Math.Sin(longitude);
                z += Math.Sin(latitude);
            }

            var total = geoCoordinates.Count;

            x = x / total;
            y = y / total;
            z = z / total;

            var centralLongitude = Math.Atan2(y, x);
            var centralSquareRoot = Math.Sqrt(x * x + y * y);
            var centralLatitude = Math.Atan2(z, centralSquareRoot);

            return new GeoCoordinate(centralLatitude * 180 / Math.PI, centralLongitude * 180 / Math.PI);
        }
        //Convert DataTable to List
        public static List<T> ConvertDataTable<T>(DataTable dt)
        {
            List<T> data = new List<T>();
            foreach (DataRow row in dt.Rows)
            {
                T item = GetItem<T>(row);
                data.Add(item);
            }
            return data;
        }
        //Thêm phần xử lý type khi value of field = null
        public static T GetItem<T>(DataRow dr)
        {
            Type temp = typeof(T);
            T obj = Activator.CreateInstance<T>();

            foreach (DataColumn column in dr.Table.Columns)
            {
                column.ColumnName = ConvertToPascalCase(column.ColumnName);
                foreach (PropertyInfo pro in temp.GetProperties())
                {
                    if (pro.Name.ToLower() == column.ColumnName.ToLower())
                    {
                        object value = dr[column.ColumnName];
                        if (value == DBNull.Value)
                        {
                            value = null;
                            pro.SetValue(obj, value, null);
                        }
                        else
                        {
                            pro.SetValue(obj, dr[column.ColumnName], null);
                        }
                    }
                    else
                        continue;
                }
            }
            return obj;
        }

        //Convert string to pascal case => Sai với trường hợp ban đầu là Pascal Case
        public static string ConvertToPascalCase(string textToChange)
        {
            System.Text.StringBuilder resultBuilder = new System.Text.StringBuilder();

            foreach (char c in textToChange)
            {
                // Replace anything, but letters and digits, with space
                if (!Char.IsLetterOrDigit(c))
                {
                    resultBuilder.Append(" ");
                }
                else
                {
                    resultBuilder.Append(c);
                }
            }

            string result = resultBuilder.ToString();

            // Make result string all lowercase, because ToTitleCase does not change all uppercase correctly
            result = result.ToLower();

            // Creates a TextInfo based on the "en-US" culture.
            TextInfo myTI = new CultureInfo("en-US", false).TextInfo;
            result = myTI.ToTitleCase(result).Replace(" ", String.Empty);
            return result;
        }

        public static byte[] GeneratorQRCode(string content)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(content, QRCodeGenerator.ECCLevel.Q);
            QRCode qrCode = new QRCode(qrCodeData);
            var qrCodeImage = qrCode.GetGraphic(20, Color.Black, Color.White, true);
            using (MemoryStream stream = new MemoryStream())
            {
                qrCodeImage.Save(stream, ImageFormat.Png);
                return stream.ToArray();
            }
        }

        public static string GenerateQRCode(string content)
        {
            var result = string.Empty;
            if (content != null)
            {
                QRCodeGenerator qrGenerator = new QRCodeGenerator();
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(content, QRCodeGenerator.ECCLevel.Q);
                QRCode qrCode = new QRCode(qrCodeData);
                var qrCodeImage = qrCode.GetGraphic(20, Color.Black, Color.White, true);
                using (MemoryStream stream = new MemoryStream())
                {
                    qrCodeImage.Save(stream, ImageFormat.Png);
                    result = Convert.ToBase64String(stream.ToArray());
                }
            }
            return result;
        }

        public static string GenerateBarCode(string content)
        {
            string dt = "";
            try
            {
                BarcodeWriterPixelData writer = new BarcodeWriterPixelData()
                {
                    Format = BarcodeFormat.CODE_128
                };
                var pixelData = writer.Write(content);

                using (var bitmap = new System.Drawing.Bitmap(pixelData.Width, pixelData.Height, System.Drawing.Imaging.PixelFormat.Format32bppRgb))
                {
                    using (var ms = new System.IO.MemoryStream())
                    {
                        var bitmapData = bitmap.LockBits(new System.Drawing.Rectangle(0, 0, pixelData.Width, pixelData.Height), System.Drawing.Imaging.ImageLockMode.WriteOnly, System.Drawing.Imaging.PixelFormat.Format32bppRgb);
                        try
                        {
                            // we assume that the row stride of the bitmap is aligned to 4 byte multiplied by the width of the image   
                            System.Runtime.InteropServices.Marshal.Copy(pixelData.Pixels, 0, bitmapData.Scan0, pixelData.Pixels.Length);
                        }
                        finally
                        {
                            bitmap.UnlockBits(bitmapData);
                        }
                        Bitmap bitmap2 = new Bitmap(bitmap, bitmap.Width, 50);

                        // PNG or JPEG or whatever you want
                        bitmap2.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                        dt = Convert.ToBase64String(ms.ToArray());
                    }
                }
            }
            catch (Exception ex) { }
            return dt;
        }
        private static HttpWebRequest CreateWebRequest(string url)
        {
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(url);
            webRequest.Method = "GET";
            webRequest.UseDefaultCredentials = true;

            return webRequest;
        }

        public static JMessage Zoom(string token, string data)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var appSetting = CommonUtil.GetConfiguration().GetSection("AppSettings");

                var zoomUrl = appSetting.GetSection("ZoomURL").Value;
                //var data = JsonConvert.SerializeObject(obj,
                //            Newtonsoft.Json.Formatting.None,
                //            new JsonSerializerSettings
                //            {
                //                NullValueHandling = NullValueHandling.Ignore
                //            });

                var httpWebRequest = (HttpWebRequest)WebRequest.Create(zoomUrl);
                httpWebRequest.ContentType = "application/json";
                httpWebRequest.Method = "POST";
                httpWebRequest.Headers["Authorization"] = string.Format("Bearer {0}", token);

                using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                {
                    streamWriter.Write(data);
                }

                var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    var result = streamReader.ReadToEnd();

                    if (!string.IsNullOrEmpty(result))
                    {
                        var rs = JsonConvert.DeserializeObject<ResponseZoom>(result);
                        msg.Title = rs.topic;
                        msg.Object = rs;
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = "Không tạo được room";
                    }
                }
            }
            catch (WebException wex)
            {
                msg.Error = true;
                if (wex.Response != null)
                {
                    var statusCode = (int)((HttpWebResponse)wex.Response).StatusCode;

                    using (var errorResponse = (HttpWebResponse)wex.Response)
                    {
                        using (var reader = new StreamReader(errorResponse.GetResponseStream()))
                        {
                            try
                            {
                                var error = reader.ReadToEnd();
                                if (statusCode != 500)
                                {
                                    msg.Title = "Có lỗi xảy ra khi tạo room";
                                }
                                else
                                {
                                    msg.Title = "Hệ thống tạm thời gián đoạn, vui lòng liên hệ ban quản trị";
                                }
                            }
                            catch (Exception ex)
                            {
                                msg.Title = ex.Message;
                            }
                        }
                    }
                }
            }

            return msg;
        }

        public static JMessage GetAuthorizationCode(string clientId, string callbackUrl, string tokenId)
        {
            var msg = new JMessage() { Error = false };

            msg.Object =
                $"https://zoom.us/oauth/authorize?response_type=code&client_id={clientId}&redirect_uri={callbackUrl}&state={tokenId}";
            return msg;
        }

        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }
        public static ZoomAuthResult ExchangeCodeForZoomToken(string clientId, string clientSecret, string authourizationCode, string uri)
        {
            //var msg = new JMessage() { Error = false };
            var client = new RestClient("https://zoom.us/oauth/token");
            var request = new RestRequest("https://zoom.us/oauth/token", Method.Post);
            var basicEncode = Base64Encode($"{clientId}:{clientSecret}");
            request.AddHeader("Authorization", $"Basic {basicEncode}");
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("code", authourizationCode);
            request.AddParameter("grant_type", "authorization_code");
            request.AddParameter("redirect_uri", uri);
            RestResponse response = client.Execute(request);
            var zoomAuthResult = JsonConvert.DeserializeObject<ZoomAuthResult>(response.Content);
            //msg.Object = zoomAuthResult;
            return zoomAuthResult;
        }

        public class RefreshZoomReport
        {
            public ZoomAuthResult ZoomAuth { get; set; }
            public string ErrorContent { get; set; }
        }

        public static RefreshZoomReport RefreshZoomToken(string clientId, string clientSecret, string refreshToken)
        {
            var content = "";
            try
            {
                var client = new RestClient("https://zoom.us/oauth/token");
                var request = new RestRequest("https://zoom.us/oauth/token", Method.Post);
                var basicEncode = Base64Encode($"{clientId}:{clientSecret}");
                request.AddHeader("Authorization", $"Basic {basicEncode}");
                request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                request.AddParameter("refresh_token", refreshToken);
                request.AddParameter("grant_type", "refresh_token");
                //request.AddParameter("redirect_uri", uri);
                RestResponse response = client.Execute(request);
                content = response.Content;
                var refreshZoomReport = new RefreshZoomReport
                {
                    ZoomAuth = JsonConvert.DeserializeObject<ZoomAuthResult>(response.Content),
                    ErrorContent = response.Content
                };
                //var zoomAuthResult
                //msg.Object = zoomAuthResult;
                return refreshZoomReport;
            }
            catch (Exception ex)
            {
                return new RefreshZoomReport
                {
                    ZoomAuth = new ZoomAuthResult(),
                    ErrorContent = content
                };
            }
        }

        public static JMessage GetUserId(string token)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var zoomUrl = string.Format("https://api.zoom.us/v2/users/me");

                var httpWebRequest = (HttpWebRequest)WebRequest.Create(zoomUrl);
                httpWebRequest.ContentType = "application/json";
                httpWebRequest.Method = "GET";
                httpWebRequest.Headers["Authorization"] = string.Format("Bearer {0}", token);

                var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    var result = streamReader.ReadToEnd();

                    if (!string.IsNullOrEmpty(result))
                    {
                        var rs = JsonConvert.DeserializeObject<ResponseZoom2>(result);
                        msg.Object = rs.Id;
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Object = "ERROR_USER_ID";
                        msg.Title = "Không lấy được UserId";
                    }
                }
            }
            catch (WebException wex)
            {
                msg.Error = true;
                if (wex.Response != null)
                {
                    var statusCode = (int)((HttpWebResponse)wex.Response).StatusCode;

                    using (var errorResponse = (HttpWebResponse)wex.Response)
                    {
                        using (var reader = new StreamReader(errorResponse.GetResponseStream()))
                        {
                            try
                            {
                                var error = reader.ReadToEnd();
                                msg.Title = statusCode != 500 ? "Có lỗi xảy ra khi tạo meeting" : "Hệ thống tạm thời gián đoạn, vui lòng liên hệ ban quản trị";
                                msg.Object = statusCode == 401 ? "ERROR_TOKEN_INVALID" : "ERROR_CONNECT_ZOOM";
                            }
                            catch (Exception ex)
                            {
                                msg.Title = ex.Message;
                                msg.Object = "ERROR_CONNECT_ZOOM";
                            }
                        }
                    }
                }
            }

            return msg;
        }

        public static JMessage SetHostKey(string token, string hostKey)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var zoomUrl = string.Format("https://api.zoom.us/v2/users/me");

                var httpWebRequest = (HttpWebRequest)WebRequest.Create(zoomUrl);
                httpWebRequest.ContentType = "application/json";
                httpWebRequest.Method = "PATCH";
                httpWebRequest.Headers["Authorization"] = string.Format("Bearer {0}", token);
                var obj = new ZoomHostSetting
                {
                    HostKey = hostKey
                };
                var data = JsonConvert.SerializeObject(obj);
                using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                {
                    streamWriter.Write(data);
                }

                var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    var result = streamReader.ReadToEnd();

                    msg.Object = result;
                }
            }
            catch (WebException wex)
            {
                msg.Error = true;
                if (wex.Response != null)
                {
                    var statusCode = (int)((HttpWebResponse)wex.Response).StatusCode;

                    using (var errorResponse = (HttpWebResponse)wex.Response)
                    {
                        using (var reader = new StreamReader(errorResponse.GetResponseStream()))
                        {
                            try
                            {
                                var error = reader.ReadToEnd();
                                if (statusCode != 500)
                                {
                                    msg.Title = "Có lỗi xảy ra khi set meeting";
                                }
                                else
                                {
                                    msg.Title = "Hệ thống tạm thời gián đoạn, vui lòng liên hệ ban quản trị";
                                }
                            }
                            catch (Exception ex)
                            {
                                msg.Title = ex.Message;
                            }
                        }
                    }
                }
            }

            return msg;
        }

        public static JMessage GetHostKey(string token)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var zoomUrl = string.Format("https://api.zoom.us/v2/users/me");

                var httpWebRequest = (HttpWebRequest)WebRequest.Create(zoomUrl);
                httpWebRequest.ContentType = "application/json";
                httpWebRequest.Method = "GET";
                httpWebRequest.Headers["Authorization"] = string.Format("Bearer {0}", token);

                var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    var result = streamReader.ReadToEnd();

                    if (!string.IsNullOrEmpty(result))
                    {
                        var rs = JsonConvert.DeserializeObject<ResponseZoom2>(result);
                        msg.Object = rs.HostKey;
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Object = "ERROR_USER_ID";
                        msg.Title = "Không lấy được UserId";
                    }
                }
            }
            catch (WebException wex)
            {
                msg.Error = true;
                if (wex.Response != null)
                {
                    var statusCode = (int)((HttpWebResponse)wex.Response).StatusCode;

                    using (var errorResponse = (HttpWebResponse)wex.Response)
                    {
                        using (var reader = new StreamReader(errorResponse.GetResponseStream()))
                        {
                            try
                            {
                                var error = reader.ReadToEnd();
                                msg.Title = statusCode != 500 ? "Có lỗi xảy ra khi tạo meeting" : "Hệ thống tạm thời gián đoạn, vui lòng liên hệ ban quản trị";
                                msg.Object = statusCode == 401 ? "ERROR_TOKEN_INVALID" : "ERROR_CONNECT_ZOOM";
                            }
                            catch (Exception ex)
                            {
                                msg.Title = ex.Message;
                                msg.Object = "ERROR_CONNECT_ZOOM";
                            }
                        }
                    }
                }
            }

            return msg;
        }

        public static JMessage CreateMeeting(string token, string data, string userZoomId)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var zoomUrl = string.Format("https://api.zoom.us/v2/users/{0}/meetings", userZoomId);

                var httpWebRequest = (HttpWebRequest)WebRequest.Create(zoomUrl);
                httpWebRequest.ContentType = "application/json";
                httpWebRequest.Method = "POST";
                httpWebRequest.Headers["Authorization"] = string.Format("Bearer {0}", token);

                using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                {
                    streamWriter.Write(data);
                }

                var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    var result = streamReader.ReadToEnd();

                    if (!string.IsNullOrEmpty(result))
                    {
                        var rs = JsonConvert.DeserializeObject<ResponseZoom>(result);
                        msg.Title = rs.topic;
                        msg.Object = rs;
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = "Không tạo được meeting";
                    }
                }
            }
            catch (WebException wex)
            {
                msg.Error = true;
                if (wex.Response != null)
                {
                    var statusCode = (int)((HttpWebResponse)wex.Response).StatusCode;

                    using (var errorResponse = (HttpWebResponse)wex.Response)
                    {
                        using (var reader = new StreamReader(errorResponse.GetResponseStream()))
                        {
                            try
                            {
                                var error = reader.ReadToEnd();
                                if (statusCode != 500)
                                {
                                    msg.Title = "Có lỗi xảy ra khi tạo meeting";
                                }
                                else
                                {
                                    msg.Title = "Hệ thống tạm thời gián đoạn, vui lòng liên hệ ban quản trị";
                                }
                            }
                            catch (Exception ex)
                            {
                                msg.Title = ex.Message;
                            }
                        }
                    }
                }
            }

            return msg;
        }

        public static JMessage DeleteZoom(string url, string token, string data)
        {
            var msg = new JMessage() { Error = false };
            try
            {
                var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
                httpWebRequest.ContentType = "application/json";
                httpWebRequest.Method = "POST";
                httpWebRequest.Headers["Authorization"] = string.Format("Bearer {0}", token);

                using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                {
                    streamWriter.Write(data);
                }

                var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    var result = streamReader.ReadToEnd();

                    if (!string.IsNullOrEmpty(result))
                    {
                        var rs = JsonConvert.DeserializeObject<ResponseZoom>(result);
                        msg.Title = rs.topic;
                        msg.Object = rs;
                    }
                    else
                    {
                        msg.Error = true;
                        msg.Title = "Không xóa được room";
                    }
                }
            }
            catch (WebException wex)
            {
                msg.Error = true;
                if (wex.Response != null)
                {
                    var statusCode = (int)((HttpWebResponse)wex.Response).StatusCode;

                    using (var errorResponse = (HttpWebResponse)wex.Response)
                    {
                        using (var reader = new StreamReader(errorResponse.GetResponseStream()))
                        {
                            try
                            {
                                var error = reader.ReadToEnd();
                                if (statusCode != 500)
                                {
                                    msg.Title = "Có lỗi xảy ra khi tạo room";
                                }
                                else
                                {
                                    msg.Title = "Hệ thống tạm thời gián đoạn, vui lòng liên hệ ban quản trị";
                                }
                            }
                            catch (Exception ex)
                            {
                                msg.Title = ex.Message;
                            }
                        }
                    }
                }
            }

            return msg;
        }

        public static async Task<JMessage> SendAPIRequest(string url)
        {

            var msg = new JMessage() { Error = false };
            try
            {
                HttpWebRequest request = CreateWebRequest(url);

                using (var response = await request.GetResponseAsync() as HttpWebResponse)
                {
                    if (request.HaveResponse && response != null)
                    {
                        using (var rd = new StreamReader(response.GetResponseStream()))
                        {
                            msg.Object = rd.ReadToEnd();

                        }
                    }
                }
            }
            catch (WebException wex)
            {
                msg.Error = true;

            }

            return msg;
        }

        public static async Task<JMessage> CheckResourceExist(string url)
        {
            var msg = new JMessage() { Error = false };
            HttpWebResponse response = null;
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "HEAD";

            try
            {
                response = await request.GetResponseAsync() as HttpWebResponse;
            }
            catch (WebException ex)
            {
                msg.Error = true;
            }
            finally
            {
                if (response != null)
                {
                    response.Close();
                }
            }

            return msg;
        }
        public static Bitmap ResizeImage(Image image, int width, int height)
        {
            var destRect = new Rectangle(0, 0, width, height);
            var destImage = new Bitmap(width, height);

            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                    graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                }
            }

            return destImage;
        }
        public static byte[] ResizeImage(byte[] byteImages, int new_height, int new_width)
        {
            using (var ms = new MemoryStream(byteImages))
            {
                Bitmap new_image = new Bitmap(new_width, new_height);
                Graphics g = Graphics.FromImage((Image)new_image);
                g.InterpolationMode = InterpolationMode.High;
                g.DrawImage(Image.FromStream(ms), 0, 0, new_width, new_height);

                using (var stream = new MemoryStream())
                {
                    new_image.Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                    return stream.ToArray();
                }
            }
        }
        public static string ConvertFileName(string s)
        {
            Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
            string temp = s.Normalize(NormalizationForm.FormD);
            return regex.Replace(temp, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');
        }
        public static IConfigurationRoot GetConfiguration()
        {
            var builder = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            return builder.Build();
        }
        #region Controller
        public const string Controller_DashBoard = "DashBoard";
        public const string Controller_HREmployee = "HREmployee";
        public const string Controller_EmployeeComSetting = "EmployeeComSetting";

        public const string Controller_Contract = "Contract";
        public const string Controller_SendRequestImportProduct = "SendRequestImportProduct";
        public const string Controller_ReportSendRequestImportProduct = "ReportSendRequestImportProduct";
        public const string Controller_ContractPo = "ContractPo";
        public const string Controller_ContractProgress = "ContractProgress";
        public const string Controller_ContractComSetting = "AContractComSetting";

        public const string Controller_Project = "Project";
        public const string Controller_ProjectProgress = "ProjectProgress";
        public const string Controller_ProjectManagement = "ProjectManagement";
        public const string Controller_ProjectComSetting = "ProjectComSetting";

        public const string Controller_Supplier = "Supplier";
        public const string Controller_ContactSupplier = "ContactSupplier";
        public const string Controller_MapSupplier = "MapSupplier";
        public const string Controller_SupplierProgress = "SupplierProgress";
        public const string Controller_SupplierComSetting = "SupplierComSetting";

        public const string Controller_Customer = "Customer";
        public const string Controller_ImportCustomer = "ImportCustomer";
        public const string Controller_OrderRequestRaw = "OrderRequestRaw";
        public const string Controller_ContactCustomer = "ContactCustomer";
        public const string Controller_ReminderAttr = "ReminderAttr";
        public const string Controller_CustomerReminder = "CustomerReminder";
        public const string Controller_CustomerProgress = "CustomerProgress";
        public const string Controller_CardJob = "CardJob";
        public const string Controller_MapCustomer = "MapCustomer";
        public const string Controller_ManagerPosition = "ManagerPosition";
        public const string Controller_CustomerComSetting = "CustomerComSetting";

        public const string Controller_FundCatReptExps = "FundCatReptExps";
        public const string Controller_FundCurrency = "FundCurrency";
        public const string Controller_FundExchagRate = "FundExchagRate";
        public const string Controller_FundAccEntry = "FundAccEntry";
        public const string Controller_FundPlanAccEntry = "FundPlanAccEntry";
        public const string Controller_ParamForWarning = "ParamForWarning";
        public const string Controller_FundReport = "FundReport";
        public const string Controller_FundWarning = "FundWarning";
        public const string Controller_FundComSetting = "FundComSetting";
        public const string Controller_FundSMS = "FundSMS";

        public const string Controller_EDMSRepository = "EDMSRepository";
        public const string Controller_EDMSRepositoryReport = "EDMSRepositoryReport";
        public const string Controller_EDMSWareHouseProfileVouchers = "EDMSWareHouseProfileVouchers";
        public const string Controller_EDMSWareHouseProfileVouchersDocument = "EDMSWareHouseProfileVouchersDocument";
        public const string Controller_EDMSWarehouseManager = "EDMSWarehouseManager";

        public const string Controller_ServiceCategory = "ServiceCategory";
        public const string Controller_ServiceCategoryPrice = "ServiceCategoryPrice";
        public const string Controller_ServiceCategoryGroup = "ServiceCategoryGroup";
        public const string Controller_ServiceCategoryType = "ServiceCategoryType";
        public const string Controller_ServiceCategoryComSetting = "ServiceCategoryComSetting";


        public const string Controller_MaterialStore = "MaterialStore";
        public const string Controller_ProductWarehouseManager = "ProductWarehouseManager";
        public const string Controller_MaterialProduct = "MaterialProduct";
        public const string Controller_MaterialProductGroup = "MaterialProductGroup";
        public const string Controller_ProductSellPrice = "ProductSellPrice";
        public const string Controller_MaterialProductHistorySale = "MaterialProductHistorySale";
        public const string Controller_Inventory = "Inventory";
        public const string Controller_ProductQRCodeManager = "ProductQRCodeManager";
        public const string Controller_ProductAttributeQRCode = "ProductAttributeQRCode";
        public const string Controller_MaterialImpStore = "MaterialImpStore";
        public const string Controller_MaterialExpStore = "MaterialExpStore";
        public const string Controller_MaterialExportInfoProduct = "Admin/MaterialExportInfoProduct";
        public const string Controller_FreeStorage = "FreeStorage";
        public const string Controller_Revenue = "Revenue";
        public const string Controller_PurchaseCost = "PurchaseCost";
        public const string Controller_MapStore = "MapStore";
        public const string Controller_WarehouseComSetting = "WarehouseComSetting";
        public const string Controller_ReportStaticsPoCus = "ReportStaticsPoCus";
        public const string Controller_ReportStaticsPoCusPayment = "ReportStaticsPoCusPayment";
        public const string Controller_ReportStaticsPoSup = "ReportStaticsPoSup";
        public const string Controller_ReportStaticsPoSupPayment = "ReportStaticsPoSupPayment";
        public const string Controller_ReportStaticsStockCard = "ReportStaticsStockCard";
        public const string Controller_ReportStaticsPoSupChart = "ReportStaticsPoSupChart";

        public const string Controller_IconManager = "IconManager";
        public const string Controller_CommonSetting = "CommonSetting";
        public const string Controller_GalaxyKeyword = "GalaxyKeyword";


        public const string Controller_Permission = "Permission";
        public const string Controller_Resource = "Resource";
        public const string Controller_Function = "Function";
        public const string Controller_Role = "Role";
        public const string Controller_GroupUser = "GroupUser";
        public const string Controller_Department = "Department";
        public const string Controller_Organization = "Organization";
        public const string Controller_User = "User";
        #endregion

        #region Action
        public const string Action_Base_Index = "Index";
        public const string Action_Insert = "Insert";
        public const string Action_Update = "Update";
        public const string Action_Delete = "Delete";
        public const string Action_Approved = "Approved";
        public const string Action_Insert_Card = "Insert_Card";

        //Permission view box in dashboard
        public const string Box_Chart_Fund = "AmchartFunds";
        public const string Box_Action_Fund = "GetActionFunds";
        public const string Box_Count_Fund = "GetCountFunds";

        public const string Box_Chart_FileEdms = "AmchartFile";
        public const string Box_Action_FileEdms = "GetActionFile";
        public const string Box_Count_FileEdms = "GetCountFile";

        public const string Box_Chart_Asset = "AmchartAsset";
        public const string Box_Count_Asset = "GetCountAsset";

        public const string Box_Action_Employ = "GetActionUser";
        public const string Box_Diagram_Group_Department = "GetDataJson";

        public const string Box_CMS = "GetCmsItemLastest";

        public const string Box_Action_Group = "GetActionUserGroup";

        public const string Box_Count_Proj = "GetCountProject";
        public const string Box_Chart_Proj = "AmchartProject";

        public const string Box_Action_Card = "GetActionCardWork";
        public const string Box_Count_Card = "GetCountCardWork";
        public const string Box_Chart_Card = "AmchartCardWork";

        public const string Box_Action_Cus = "GetActionCustomer";
        public const string Box_Count_Cus = "GetCountCustomer";
        public const string Box_Chart_Cus = "AmchartCustomer";

        public const string Box_Action_Supp = "GetActionSupplier";
        public const string Box_Count_Supp = "GetCountSupplier";
        public const string Box_Chart_Supp = "AmchartSupplier";

        public const string Box_Count_Buyer = "GetCountBuyer";
        public const string Box_Chart_Buyer = "AmchartCountBuy";

        public const string Box_Chart_Sale = "AmchartCountSale";
        public const string Box_Count_Sale = "GetCountSale";

        public const string Box_Chart_Wf = "AmchartWorkFlow";
        public const string Box_Count_Wf = "GetCountWorkFlow";



        #endregion
    }

    public class SessionUserLogin
    {
        public SessionUserLogin()
        {
            IsAllData = false;
            IsBranch = false;
            IsUser = false;
            IsManager = false;
            ListRoleGroupUser = new List<GroupRole>();
            ProductComponents = new List<ProductComponent>();
            ProductAttrGalaxys = new List<ProductAttrGalaxy>();
        }
        public string Uuid { get; set; }
        public string Area { get; set; }
        public int? TypeStaff { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string EmployeeCode { get; set; }
        public string MainRole { get; set; }
        public string RoleCode { get; set; }
        public string BranchId { get; set; }
        public string DepartmentCode { get; set; }
        public string BranchCode { get; set; }
        public string BranchName { get; set; }
        public string Picture { get; set; }
        public short UserType { get; set; }
        public string LmsSessionCode { get; set; }
        public DateTime TimeStamp { get; set; }
        public List<string> ListGroupUser { get; set; }
        public List<string> ListRoleUser { get; set; }
        public List<GroupRole> ListRoleGroupUser { get; set; }
        public List<PermissionObject> Permissions { get; set; }
        public List<ProductComponent> ProductComponents { get; set; }
        public List<ProductAttrGalaxy> ProductAttrGalaxys { get; set; }
        public string ProductCustomUuid { get; set; }

        public int? AppId { get; set; }
        public string AppCode { get; set; }
        public string AppTitle { get; set; }
        public string AppIcon { get; set; }
        public string AppUrl { get; set; }

        public double SessionTimeOut { get; set; }
        public DateTime ExpireTimeSpan { get; set; }

        public string CompanyCode { get; set; }
        public bool IsAllData { get; set; }
        public bool IsBranch { get; set; }
        public bool IsUser { get; set; }
        public bool IsManager { get; set; }
        public bool IsSubAdmin { get; set; }
        public List<string> ListUserOfBranch { get; set; }
        public List<string> ListDepartment { get; set; }
        public List<string> ListUser { get; set; }
        public List<string> ListProject { get; set; }
        public List<string> ListContract { get; set; }
        public List<string> ListManager { get; set; }

        public bool HasPermission(string controllerName, string actionName)
        {
            bool isValid = false;

            var urlApi = controllerName + "_" + actionName;
            if (UserType == 10 || urlApi.Equals("Home_Permission") || urlApi.Equals("Home_SystemLocked") || urlApi.Equals("Language_Translation") || urlApi.Equals("Home_Logout"))
            {
                isValid = true;
            }
            else
            {
                if (Permissions?.Count > 0 && !string.IsNullOrEmpty(urlApi))
                {
                    isValid = Permissions.Any(x => x.ResourceCode != null && x.ResourceCode.ToLower().Equals(urlApi.ToLower()));
                }
            }

            return isValid;
        }

        public PermissionObject GetPermission(string controllerName, string actionName)
        {
            var urlApi = controllerName + "_" + actionName;
            var permission = Permissions?.FirstOrDefault(x => x.ResourceCode != null && x.ResourceCode.ToLower().Equals(urlApi.ToLower()));

            return permission;
        }
        public int IdObject { get; set; }
    }

    public class PermissionObject
    {
        public int? FunctionId { get; set; }
        public string FunctionCode { get; set; }
        public string FunctionTitle { get; set; }

        public int? ResourceId { get; set; }
        public string ResourceCode { get; set; }
        public string ResourceTitle { get; set; }
        public string ResourceApi { get; set; }

        public string GroupUserCode { get; set; }
        public string GroupUserTitle { get; set; }

        public string RoleId { get; set; }
        public string RoleTitle { get; set; }
    }

    public class ResponseZoom
    {
        public double? id { get; set; }
        public string host_id { get; set; }
        public string topic { get; set; }
        public int? type { get; set; }
        public string status { get; set; }
        public string encrypted_password { get; set; }
        public string password { get; set; }
        public string start_url { get; set; }
        public string join_url { get; set; }
        public string code { get; set; }
        public string message { get; set; }
    }

    public class ResponseZoom2
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        [JsonProperty(PropertyName = "host_key")]
        public string HostKey { get; set; }
    }

    public class SessionLanguage
    {
        public string Controller { get; set; }
        public string Action { get; set; }
        public int Id { get; set; }
    }

    public class JsonSessionLogin
    {
        public string Ip { get; set; }
        public string Device { get; set; }
        public DateTime TimeStamp { get; set; }
    }

    public class GroupRole
    {
        public string RoleId { get; set; }
        public string GroupUserCode { get; set; }
    }
    public class ListHelper<T>
    {
        public static bool ContainsAllItems(List<T> a, List<T> b)
        {
            return !b.Except(a).Any();
        }
    }
}
