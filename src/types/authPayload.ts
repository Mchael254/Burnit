export type registerPayload = {
  name: string;
  password: string;
  email: string;
}

export type loginPayload = {
  email: string;
  password: string;

}

export type logoutPayload = {
  refresh_token: string | null;
}

export type UserProfile = {
  name: string;
  email: string;
  creation_timestamp: string;
}

export type SaveProfile = {
  name: string;
  email: string;
  password: string;
}


