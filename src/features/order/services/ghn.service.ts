import envConfig from "@/lib/api/envConfig";

const TOKEN = process.env.NEXT_PUBLIC_GHN_TOKEN!;
const SHOP_ID = process.env.NEXT_PUBLIC_GHN_SHOP_ID!;

const headers = {
    "Content-Type": "application/json",
    Token: TOKEN,
    ShopId: SHOP_ID,
};

export const getProvinces = async () => {
    const res = await fetch("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", { headers });
    const data = await res.json();
    return data.data;
};

export const getDistricts = async (provinceId: number) => {
    const res = await fetch("https://online-gateway.ghn.vn/shiip/public-api/master-data/district", {
        method: "POST",
        headers,
        body: JSON.stringify({ province_id: provinceId }),
    });
    const data = await res.json();
    return data.data;
};

export const getWards = async (districtId: number) => {
    const res = await fetch("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward", {
        method: "POST",
        headers,
        body: JSON.stringify({ district_id: districtId }),
    });
    const data = await res.json();
    return data.data;
};
export const calculateShippingFee = async ({
    insurance_value,
    fromDistrict,
    toDistrict,
    toWardCode,
    // height,
    // length,
    weight,
    // width,

}: {
    insurance_value: number;
    fromDistrict: number;
    toDistrict: number;
    toWardCode: string;
    // height: number;
    // length: number;
    weight: number;
    // width: number;
}) => {
    const serviceId = await getServiceId({ fromDistrict, toDistrict });

    if (!serviceId) {
        throw new Error("Không lấy được serviceId");
    }

    const res = await fetch("https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Token": TOKEN,
            "ShopId": SHOP_ID.toString(),
        },
        body: JSON.stringify({
            service_id: serviceId,
            insurance_value: insurance_value,
            coupon: null,
            from_district_id: fromDistrict,
            to_district_id: toDistrict,
            to_ward_code: toWardCode,
            // height,
            // length,
            weight,
            // width,
        }),
    });

    const data = await res.json();
    return data.data?.total || 0;
};

const getServiceId = async ({
    fromDistrict,
    toDistrict,
}: {
    fromDistrict: number;
    toDistrict: number;
}): Promise<number | null> => {
    try {
        const res = await fetch("https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Token": TOKEN, // Thay bằng token thật của bạn
            },
            body: JSON.stringify({
                shop_id: Number(SHOP_ID),
                from_district: fromDistrict,
                to_district: toDistrict,
            }),
        });

        const data = await res.json();
        const services = data?.data;

        if (services && services.length > 0) {
            return services[0].service_id; // lấy dịch vụ đầu tiên
        }

        return null;
    } catch (error) {
        console.error("Lỗi lấy serviceId:", error);
        return null;
    }
};