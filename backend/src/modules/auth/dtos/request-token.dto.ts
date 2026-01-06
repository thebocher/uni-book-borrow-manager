import { IsDefined } from "class-validator";

export default class RequestTokenDto {
    @IsDefined()
    username: string;

    @IsDefined()
    password: string;
}