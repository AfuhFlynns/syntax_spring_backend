export interface usersSchemaTypes {
  username: string;
  names: {
    firstName: string;
    lastName: string;
  };
  email: string;
  phoneNumber?: string;
  password: string;
  role: "admin" | "user" | "editor";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  preferences?: {
    theme: "light" | "dark";
    acceptNotifications: boolean;
  };
  tokens: {
    type: "access" | "refresh" | "resetPassword";
    token: string;
    expiresAt: Date;
  }[];
  codes: {
    type: "verification" | "coupon";
    code: string;
    expiresAt: Date;
  }[];
}

export interface challengesTypes {
  title: string;
  type: "html" | "css" | "js" | "tailwindcss" | "ts" | "python" | "c/c++";
  description: string;
  difficulty: string;
  initialCode: string;
  solution: string;
  hints: {
    hint: string;
  }[];
  tags: {
    tag: string;
  }[];
}
