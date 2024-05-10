import { DropEvent } from "./dropevent.model";

export interface ValidateDropParams extends DropEvent {}

export type ValidateDrop = (params: ValidateDropParams) => boolean;