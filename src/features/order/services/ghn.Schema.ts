import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const schemaGHN = z.object({
    province: z.string(),
    district: z.string(),
    ward: z.string(),
    address: z.string(),
});

export type FormDataGHN = z.infer<typeof schemaGHN>;