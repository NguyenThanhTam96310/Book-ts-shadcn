export type UserRes = {
    userId: string
    username: string
    fullName?: string
    email?: string
    avatar?: string
    mobileNumber?: string
    addressId?: number
};
export type AddressRes = {
    addressId: number,
    buildinggName: string,
    city: string,
    country: string,
    district: string,
    pincode: string,
    ward: string
}
