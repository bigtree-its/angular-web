export class ServerResponse {
    type: ResponseType;
    message: string;
    // constructor(type: ResponseType, message: string){
    //     this.message = message;
    //     this.type = type;
    // }
}

export enum ResponseType {
    Success, Error
  }