'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchMenuFooter,
  MenuItem,
} from "@/features/menu";

import {
  ShoppingBag,
  HelpCircle,
  HeadphonesIcon,
  TruckIcon,
  RefreshCw,
  PackageSearch,
  User,
  LogIn,
  UserPlus,
  Phone,
  Mail,
  Store,
} from "lucide-react";

export default function MenuFooter() {
  const [groupedMenus, setGroupedMenus] = useState<
    (MenuItem & { childrens: MenuItem[] })[]
  >([]);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const data = await fetchMenuFooter();
        const footerMenus = data.filter((menu: MenuItem) => menu.position === "FOOTERMENU");

        const parents = footerMenus.filter((menu) => !menu.parent);
        const grouped = parents.map((parent) => ({
          ...parent,
          childrens: footerMenus.filter((child) => child.parent?.menuId === parent.menuId),
        }));

        setGroupedMenus(grouped);
      } catch (error) {
        console.error("Lỗi khi load Menu:", error);
      }
    };

    loadMenus();
  }, []);

  return (
    <div className="md:col-span-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {groupedMenus.map((parent) => (
          <div key={parent.menuId} className="text-left">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-orange-500">
              {getIcon(parent.name)}
              <span>{parent.name}</span>
            </h3>

            <ul className="space-y-2 text-sm text-white">
              {parent.childrens.map((child) => (
                <li key={child.menuId}>
                  <Link
                    href={child.link}
                    className="hover:text-orange-400 flex items-center gap-2"
                  >
                    {getIcon(child.name)}
                    <span>{child.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// Hàm trả về icon phù hợp với tên menu
function getIcon(name: string) {
  const normalized = name.toLowerCase();

  switch (normalized) {
    case "dịch vụ":
      return <ShoppingBag size={16} />;
    case "hỗ trợ":
      return <HelpCircle size={16} />;
    case "tài khoản":
      return <User size={16} />;
    case "liên hệ":
      return <Phone size={16} />;

    case "sản phẩm":
      return <ShoppingBag size={14} />;
    case "câu hỏi thường gặp":
      return <HelpCircle size={14} />;
    case "hỗ trợ khách hàng":
      return <HeadphonesIcon size={14} />;
    case "vận chuyển":
      return <TruckIcon size={14} />;
    case "chính sách đổi trả":
      return <RefreshCw size={14} />;
    case "theo dõi đơn hàng":
      return <PackageSearch size={14} />;

    case "đăng nhập":
      return <LogIn size={14} />;
    case "đăng ký":
      return <UserPlus size={14} />;
    case "tài khoản của tôi":
      return <User size={14} />;

    case "email":
      return <Mail size={14} />;
    case "sđt":
      return <Phone size={14} />;
    case "tìm cửa hàng":
      return <Store size={14} />;
    default:
      return null;
  }
}
