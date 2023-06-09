export type ResponseMessage = {
  message: string;
};

export type SignInResponse = {
  message: string;
  sessionToken: string;
};

export type ErrorMessage = {
  error: {
    message: string;
  };
};

export type SessionToken = string;
export type SessionTime = string;
