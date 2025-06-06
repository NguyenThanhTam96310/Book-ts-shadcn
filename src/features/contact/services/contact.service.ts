
import { ContactSchemaType } from "@/features/contact/services/contact.Schema";
import axiosInstance from "@/lib/api/Config";
import envConfig from "@/lib/api/envConfig"

export async function fetchContact(body: ContactSchemaType): Promise<void> {
    const res = await axiosInstance.post<void>(`${envConfig.NEXT_PUBLIC_API}/public/contacts`, body);
    return res.data;
}
