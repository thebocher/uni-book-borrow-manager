import { SetMetadata } from "@nestjs/common";

export const ALLOW_UNAUTHORIZED = 'allow_unauthorized';

export const AllowUnauthorized = () => SetMetadata(ALLOW_UNAUTHORIZED, true);