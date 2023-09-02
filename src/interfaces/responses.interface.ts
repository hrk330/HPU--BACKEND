import { AppUsers, ServiceProvider } from "../models";

export interface CodeVerificationResponse {
	code: number;
	msg: string;
	user?: AppUsers|ServiceProvider;
}