export interface IPushNotificacion {
    notification: {
        title: string;
        body: string;
    };
    data: any;
    token: string;
}
export declare const sendMessage: (messages: IPushNotificacion) => Promise<void>;
