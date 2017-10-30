interface Message {
    topic: any;
    action?: any;
    isAck?: boolean;
    name?: string;
    subscription?: string;
    data?: string;
    parsedData?: any;
    isError?: boolean;
    processedError?: boolean;
}
