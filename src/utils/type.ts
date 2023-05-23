export enum EmailSubject {
  ACCOUNT_VERIFICATION = 'Account Verification',
  FORGOT_PASSWORD = 'Forgot Password'
}

export const generateRandomAlphaNumeric = (length: number) => {
  let s = '';
  Array.from({ length }).some(() => {
    s += Math.random().toString(36).slice(2);
    return s.length >= length;
  });
  return s.slice(0, length);
};