const verificationEmailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    /* Dark Mode Styles */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #121212;
        color: #e0e0e0;
      }
      .email-container {
        background-color: #1e1e1e;
        border: 1px solid #333333;
      }
      .email-header {
        background-color: #1a73e8;
      }
      .verification-code {
        background-color: #333333;
        color: #ffffff;
        border: 1px solid #555555;
      }
      .email-button {
        background-color: #1a73e8;
        color: #ffffff;
      }
      .email-footer {
        background-color: #292929;
        color: #aaaaaa;
      }
    }
  </style>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f7fc; color: #333333;">
  <div class="email-container" style="min-height: 85vh; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e1e4e8; display: flex; flex-direction: column; justify-content: space-between;">
    <!-- Header -->
    <div class="email-header" style="text-align: center; padding: 20px; background-color: #0073e6;">
      <img src="[logo_url]" alt="SyntaxSpring Logo" style="max-width: 150px;">
    </div>
    
    <!-- Main Content -->
    <div style="padding: 20px; flex-grow: 1;">
      <h1 style="color: #0073e6; text-align: center;">Verify Your Email</h1>
      <p style="font-size: 16px; text-align: center;">
        Thank you for signing up with SyntaxSpring! Use the code below to verify your email address or click the button to activate your account.
      </p>
      <!-- Verification Code -->
      <div class="verification-code" style="text-align: center; margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; color: #0073e6; background-color: #f1f8fe; border-radius: 8px; border: 1px solid #d6e9ff; max-width: 300px;">
        123456
      </div>
      <!-- Button -->
      <div style="text-align: center; margin: 20px;">
        <a class="email-button" href="[verification_link]" style="background-color: #0073e6; color: #ffffff; text-decoration: none; padding: 12px 20px; font-size: 16px; border-radius: 5px; display: inline-block;">Verify Email</a>
      </div>
      <p style="font-size: 14px; text-align: center;">
        If you didn’t sign up, ignore this email or contact support for assistance.
      </p>
    </div>
    
    <!-- Footer -->
    <div class="email-footer" style="background-color: #f9fafc; padding: 10px; text-align: center; font-size: 14px; color: #666666;">
      <p>Need help? <a href="[support_link]" style="color: #0073e6;">Contact our support team</a>.</p>
    </div>
  </div>
</body>
</html>
`;
const welcomeEmailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome</title>
  <style>
    /* Dark Mode Styles */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #121212;
        color: #e0e0e0;
      }
      .email-container {
        background-color: #1e1e1e;
        border: 1px solid #333333;
      }
      .email-header {
        background-color: #1a73e8;
      }
      .email-button {
        background-color: #1a73e8;
        color: #ffffff;
      }
      .email-footer {
        background-color: #292929;
        color: #aaaaaa;
      }
    }
  </style>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f7fc; color: #333333;">
  <div class="email-container" style="min-height: 85vh; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e1e4e8; display: flex; flex-direction: column; justify-content: space-between;">
    <!-- Header -->
    <div class="email-header" style="text-align: center; padding: 20px; background-color: #0073e6;">
      <img src="[welcome_image_url]" alt="Welcome Image" style="max-width: 100%; height: auto;">
    </div>
    
    <!-- Main Content -->
    <div style="padding: 20px; flex-grow: 1;">
      <h1 style="color: #0073e6; text-align: center;">Welcome to SyntaxSpring!</h1>
      <p style="font-size: 16px; text-align: center;">
        We're thrilled to have you with us. Start exploring our tools and features today to boost your productivity!
      </p>
      <div style="text-align: center; margin: 20px;">
        <a class="email-button" href="[dashboard_link]" style="background-color: #0073e6; color: #ffffff; text-decoration: none; padding: 12px 20px; font-size: 16px; border-radius: 5px; display: inline-block;">Go to Dashboard</a>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="email-footer" style="background-color: #f9fafc; padding: 10px; text-align: center; font-size: 14px; color: #666666;">
      <p>Follow us on <a href="[social_link]" style="color: #0073e6;">social media</a> for updates!</p>
    </div>
  </div>
</body>
</html>
`;
const passwordResetEmailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f7fc;">
  <div style="min-height: 85vh; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e1e4e8; display: flex; flex-direction: column; justify-content: space-between;">
    <!-- Header -->
    <div style="text-align: center; padding: 20px; background-color: #0073e6;">
      <img src="[security_image_url]" alt="Security Image" style="max-width: 100%; height: auto;">
    </div>
    
    <!-- Main Content -->
    <div style="padding: 20px; flex-grow: 1;">
      <h1 style="color: #0073e6; text-align: center;">Reset Your Password</h1>
      <p style="font-size: 16px; color: #333333; text-align: center;">
        You requested a password reset for your SyntaxSpring account. Click below to proceed:
      </p>
      <div style="text-align: center; margin: 20px;">
        <a href="[reset_link]" style="background-color: #0073e6; color: #ffffff; text-decoration: none; padding: 12px 20px; font-size: 16px; border-radius: 5px;">Reset Password</a>
      </div>
      <p style="font-size: 14px; color: #666666; text-align: center;">
        Didn’t request a reset? Your account is safe. Contact us if needed.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9fafc; padding: 10px; text-align: center; font-size: 14px; color: #666666;">
      <p>For assistance, <a href="[support_link]" style="color: #0073e6;">reach out to support</a>.</p>
    </div>
  </div>
</body>
</html>
`;
const accountDeleteEmailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Deletion</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f7fc;">
  <div style="min-height: 85vh; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e1e4e8; display: flex; flex-direction: column; justify-content: space-between;">
    <!-- Header -->
    <div style="text-align: center; padding: 20px; background-color: #b22222;">
      <img src="[goodbye_image_url]" alt="Goodbye Image" style="max-width: 100%; height: auto;">
    </div>
    
    <!-- Main Content -->
    <div style="padding: 20px; flex-grow: 1;">
      <h1 style="color: #b22222; text-align: center;">We’re Sorry to See You Go</h1>
      <p style="font-size: 16px; color: #333333; text-align: center;">
        Your account has been successfully deleted. If this was a mistake, contact us immediately to recover your account.
      </p>
      <div style="text-align: center; margin: 20px;">
        <a href="[support_link]" style="background-color: #b22222; color: #ffffff; text-decoration: none; padding: 12px 20px; font-size: 16px; border-radius: 5px;">Contact Support</a>
      </div>
      <p style="font-size: 14px; color: #666666; text-align: center;">
        Thank you for being part of SyntaxSpring. We hope to see you again.
      </p>
    </div>
  </div>
</body>
</html>
`;
const accountLogoutEmailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Deletion</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f7fc;">
  <div style="min-height: 85vh; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e1e4e8; display: flex; flex-direction: column; justify-content: space-between;">
    <!-- Header -->
    <div style="text-align: center; padding: 20px; background-color: #b22222;">
      <img src="[goodbye_image_url]" alt="Goodbye Image" style="max-width: 100%; height: auto;">
    </div>
    
    <!-- Main Content -->
    <div style="padding: 20px; flex-grow: 1;">
      <h1 style="color: #b22222; text-align: center;">We’re Sorry to See You Go</h1>
      <p style="font-size: 16px; color: #333333; text-align: center;">
        Your account has been successfully deleted. If this was a mistake, contact us immediately to recover your account.
      </p>
      <div style="text-align: center; margin: 20px;">
        <a href="[support_link]" style="background-color: #b22222; color: #ffffff; text-decoration: none; padding: 12px 20px; font-size: 16px; border-radius: 5px;">Contact Support</a>
      </div>
      <p style="font-size: 14px; color: #666666; text-align: center;">
        Thank you for being part of SyntaxSpring. We hope to see you again.
      </p>
    </div>
  </div>
</body>
</html>
`;
export { verificationEmailTemplate, welcomeEmailTemplate, accountDeleteEmailTemplate, accountLogoutEmailTemplate, passwordResetEmailTemplate, };
//# sourceMappingURL=emailTemplates.js.map