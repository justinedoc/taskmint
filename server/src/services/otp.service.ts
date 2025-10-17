import { CRYPTO } from "@server/app";
import { authenticator, totp } from "otplib";

totp.options = { step: 300 };

class OTPService {
  public generateUserSecret() {
    return authenticator.generateSecret();
  }

  public async generateOtp(secret: string) {
    const decryptedSecret = await CRYPTO.decrypt(secret);
    return totp.generate(decryptedSecret);
  }

  public async verifyOtp(otp: number, secret: string) {
    const decryptedSecret = await CRYPTO.decrypt(secret);
    return totp.check(otp.toString(), decryptedSecret);
  }
}

const otpService = new OTPService();

export default otpService;
