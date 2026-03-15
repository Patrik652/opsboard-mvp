import type { Service, ServiceStatus } from "../model";

export type CreateServiceInput = {
  userId: string;
  name: string;
  status?: ServiceStatus;
  description?: string;
};

export type UpdateServiceInput = Partial<Pick<Service, "name" | "status" | "description">>;

export type ServicesRepository = {
  listServices: (userId: string) => Promise<Service[]>;
  createService: (input: CreateServiceInput) => Promise<Service>;
  updateService: (userId: string, serviceId: string, input: UpdateServiceInput) => Promise<Service>;
};
