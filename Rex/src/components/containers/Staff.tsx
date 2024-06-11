import { staff } from "../Staff/constants";
import { columns } from "../tables/columns";
import { DataTable } from "../tables/DataTable";

const Staff = () => {
  const data = staff;
  return (
    <div className="container mx-auto py-10 bg-slate-500">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Staff;
