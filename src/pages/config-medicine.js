import { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  InputLabel,
  Menu,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/customer/customers-table";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { applyPagination } from "src/utils/apply-pagination";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dataMedicine, setDataMedicine] = useState([]);
  const [dataCategory, setDataCategory] = useState([]);
  const [totalMedicine, setTotalMedicine] = useState(0);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0.0);
  const [quantity, setQuantity] = useState(0);
  const [merchandise, setMerchandise] = useState("");
  const [cateId, setCateId] = useState(0);
  const customersSelection = useSelection(dataMedicine.map((medicine) => medicine.id));

  const fetchDataMedicine = async () => {
    const d = await axios.get(
      `http://localhost:8080/api/v1/items?page=${page}&size=${rowsPerPage}&type=1`
    );
    setDataMedicine(d.data.data);
    setTotalMedicine(d.data.meta.total);
  };

  useEffect(() => {
    fetchDataMedicine();
  }, [page, rowsPerPage]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = async () => {
    setOpen(true);
    const data = await axios.get(`http://localhost:8080/api/v1/categories?type=1`);
    setDataCategory(data.data.data);
  };

  const handleAddItem = async () => {
    const item = {
      name,
      price,
      quantity,
      merchandise,
      categoryId: cateId.id,
      userId: 1,
    };

    await axios.post(`http://localhost:8080/api/v1/items`, item);
    setOpen(false);
    fetchDataMedicine();
  };

  return (
    <>
      <Head>
        <title>Quản lý thuốc chữa bệnh</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Thuốc chữa bệnh</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => handleAdd()}
                >
                  Thêm
                </Button>
              </div>
            </Stack>
            <CustomersSearch />
            <CustomersTable
              count={totalMedicine}
              items={dataMedicine}
              onDeselectAll={customersSelection.handleDeselectAll}
              onDeselectOne={customersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={customersSelection.handleSelectAll}
              onSelectOne={customersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={customersSelection.selected}
            />
          </Stack>
        </Container>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <h2 id="add-product-modal-title">Thêm thuốc</h2>
            <TextField
              label="Tên"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Đơn giá"
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Số lượng"
              fullWidth
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Nhà sản xuất"
              fullWidth
              value={merchandise}
              onChange={(e) => setMerchandise(e.target.value)}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Nhóm</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={cateId}
                onChange={(e) => setCateId(e.target.value)}
                defaultValue={1}
              >
                {dataCategory.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: 12 }}
              onClick={handleAddItem}
            >
              Thêm
            </Button>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
