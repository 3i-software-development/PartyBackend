using Amazon.SimpleNotificationService.Model;
using Amazon.SimpleNotificationService;
using ESEIM.Models;
using ESEIM.Utils;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.Configuration;
using System.Linq;

namespace III.Admin.Utils
{
    public interface IAwsService
    {
        Task<JMessage> SendOtp(string userName, string phoneNumber);
    }
    public class AwsService : IAwsService
    {
        private readonly EIMDBContext _context;
        private readonly IConfiguration _configuration;

        public AwsService(
            EIMDBContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<JMessage> SendOtp(string userName, string phoneNumber)
        {
            var msg = new JMessage { Error = false, Title = "" };
            string topicArn = _configuration["AWSSDK:SNSTopic"];
            var otp = CommonUtil.GenerateOTP();
            string message = $"Mã OTP của quý khách là {otp}";
            //Fomart lại SDT +84 đầu
            phoneNumber = phoneNumber.IndexOf("+84") > 0
                ? phoneNumber.Trim()
                : string.Format("+84{0}", phoneNumber.Trim().Substring(1, phoneNumber.Trim().Length - 1));

            var client = new AmazonSimpleNotificationServiceClient(region: Amazon.RegionEndpoint.APSoutheast1);
            var messageAttributes = new Dictionary<string, MessageAttributeValue>();
            var smsType = new MessageAttributeValue
            {
                DataType = "String",
                StringValue = "Transactional"
            };

            messageAttributes.Add("AWS.SNS.SMS.SMSType", smsType);
            var request = new PublishRequest
            {
                Message = message,
                TopicArn = topicArn,
                MessageAttributes = messageAttributes
            };

            try
            {
                var response = await client.PublishAsync(request);

                Console.WriteLine("Message sent to topic:");
                Console.WriteLine(message);

                var otpManager = _context.OTPManagers.FirstOrDefault(x => !x.IsDeleted && x.UserName == userName);
                if (otpManager == null)
                {
                    var newOtpManager = new OTPManager
                    {
                        UserName = userName,
                        OTP = otp,
                        PhoneNumber = phoneNumber,
                        CreatedBy = userName,
                        CreatedTime = DateTime.Now
                    };

                    _context.OTPManagers.Add(newOtpManager);
                }
                else
                {
                    otpManager.OTP = otp;

                    _context.OTPManagers.Update(otpManager);
                }
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Caught exception publishing request:");
                Console.WriteLine(ex.Message);
                msg.Error = true;
                msg.Title = $"Có ngoại lệ xảy ra: {ex.Message}";
            }
            return msg;
        }
    }
}
