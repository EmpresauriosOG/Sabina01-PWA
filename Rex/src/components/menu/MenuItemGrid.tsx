import MenuItemCard, { MenuItem } from "./MenuItemCard";

interface MenuItemGridProps {
  items: MenuItem[];
  courseType?: string;
  itemAmounts: Record<string, number>;
  onAmountChange: (name: string, amount: number) => void;
  onAddToOrder: (item: MenuItem) => void;
}

export default function MenuItemGrid({
  items,
  courseType,
  itemAmounts,
  onAmountChange,
  onAddToOrder,
}: MenuItemGridProps) {
  const filtered = courseType
    ? items.filter((item) => item.course_type === courseType)
    : items;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((item) => (
        <MenuItemCard
          key={item._id}
          item={item}
          amount={itemAmounts[item.name] || 0}
          onAmountChange={onAmountChange}
          onAddToOrder={onAddToOrder}
          showBadge={!!courseType}
        />
      ))}
    </div>
  );
}
