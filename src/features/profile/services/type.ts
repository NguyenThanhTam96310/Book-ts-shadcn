export type UserRes = {
    userId: string
    username: string
    fullName?: string
    email?: string
    avatar?: string
    mobileNumber?: string
    address: AddressRes
};
export type AddressRes = {
    addressId: number,
    buildingName: string,
    city: string,
    country: string,
    district: string,
    ward: string
}
export interface MenuProfileProps {
    fullname?: string
    avatar?: string
}