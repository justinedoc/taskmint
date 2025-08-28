import { CRYPTO } from "@server/index";
import { authenticator } from "otplib";

class OTPService {
  public generateUserSecret() {
    return authenticator.generateSecret();
  }

  public async generateOtp(secret: string) {
    const decryptedSecret = await CRYPTO.decrypt(secret);
    return authenticator.generate(decryptedSecret);
  }

  public async verifyOtp(otp: number, secret: string) {
    const decryptedSecret = await CRYPTO.decrypt(secret);
    return authenticator.verify({
      token: otp.toString(),
      secret: decryptedSecret,
    });
  }
}

const otpService = new OTPService();

export default otpService;
