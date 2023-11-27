import Head from "next/head";
import {
  Alert,
  Box,
  Button,
  Container,
  Unstable_Grid2 as Grid,
  Input,
  Snackbar,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { OverviewSales } from "src/sections/overview/overview-sales";
import { OverviewTotalCustomers } from "src/sections/overview/overview-total-customers";
import { OverviewTotalProfit } from "src/sections/overview/overview-total-profit";
import { OverviewTraffic } from "src/sections/overview/overview-traffic";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const Page = () => {
  const [barChart, setBarchart] = useState([]);
  const [pieChart, setPiechart] = useState([]);
  const [monthTax, setMonthTax] = useState(0.0);
  const [lastMonthTax, setLastMonthTax] = useState(0.0);
  const [monthCategories, setMonthCategories] = useState(0.0);
  const [lastMonthCategories, setLastMonthCategories] = useState(0.0);
  const [totalTaxByCurrentYear, setTotalTaxByCurrentYear] = useState(0.0);
  const [openToast, setOpenToast] = useState(false);
  const [openToastFail, setOpenToastFail] = useState(false);
  const [excelFiles, setExcelFiles] = useState([]);

  useEffect(() => {
    fetchBarChart();
    fetchPieChart();
    fetchMonthTax();
    fetchMonthCategories();
    fetchTotalTax();
  }, []);

  const fetchBarChart = async () => {
    const data = await axios.get("http://localhost:8080/api/v1/taxes/get-by-year", {
      params: {
        type: 1,
      },
    });
    setBarchart(
      data.data.data.map((tax) => {
        return {
          name: tax.year,
          data: tax.tax,
        };
      })
    );
  };

  const fetchMonthCategories = async () => {
    const currentTime = new Date();
    const data = await axios.get(
      `http://localhost:8080/api/v1/taxes/get-categories/type/1/year/${currentTime.getFullYear()}/month/10`
    );
    const dataLastMonth = await axios.get(
      `http://localhost:8080/api/v1/taxes/get-categories/type/1/year/${currentTime.getFullYear()}/month/9`
    );
    setMonthCategories(data.data.data);
    setLastMonthCategories(dataLastMonth.data.data);
  };

  const fetchTotalTax = async () => {
    const data = await axios.get(`http://localhost:8080/api/v1/taxes/get-total-by-year?type=1`);
    setTotalTaxByCurrentYear(data.data.data);
  };

  const fetchMonthTax = async () => {
    const currentTime = new Date();
    const data = await axios.get(
      `http://localhost:8080/api/v1/taxes/type/1/year/${currentTime.getFullYear()}/month/10`
    );
    const dataLastMonth = await axios.get(
      `http://localhost:8080/api/v1/taxes/type/1/year/${currentTime.getFullYear()}/month/9`
    );
    setMonthTax(data.data.data);
    setLastMonthTax(dataLastMonth.data.data);
  };

  const fetchPieChart = async () => {
    const currentTime = new Date();
    const data = await axios.get("http://localhost:8080/api/v1/taxes/get-category-percentage", {
      params: {
        type: 1,
        year: currentTime.getFullYear(),
        // month: currentTime.getMonth() + 1,
        month: 10,
      },
    });
    let totalTax = 0;
    data.data.data.forEach((ele) => (totalTax += ele.totalTax));
    setPiechart(
      data.data.data.map((ele) => {
        return {
          id: ele.id,
          name: ele.name,
          totalTax: ele.totalTax,
          percent: +((ele.totalTax / totalTax) * 100).toPrecision(2),
        };
      })
    );
  };

  const handleUploadExcel = async () => {
    // setOpenToast(true);
    const form = new FormData();
    if (excelFiles.length) {
      form.append("file", excelFiles[0], excelFiles[0].name);
      const data = await axios.post("http://localhost:8080/api/v1/taxes/upload", form);
      if (data.data.meta.code === "200") {
        setOpenToast(true);
      } else if (data.data.meta.code === "500") {
        setOpenToastFail(true);
      }
    }
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenToast(false);
    setOpenToastFail(false);
  };

  return (
    <>
      <Head>
        <title>Thuốc </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 0,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={12}>
              <Button href="http://localhost:8080/api/v1/taxes/get-export-pdf" variant="contained">
                Tải báo cáo
              </Button>
              <Input
                style={{ marginLeft: 20 }}
                type="file"
                multiple={false}
                onChange={(e) => setExcelFiles(e.target.files)}
              />
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                style={{ marginLeft: 20 }}
                onClick={handleUploadExcel}
              >
                Tải lên excel
              </Button>
            </Grid>
            <Grid xs={12} sm={6} lg={4}>
              <OverviewBudget
                difference={
                  lastMonthCategories == 0 ? 100 : Math.abs(monthTax / lastMonthTax - 1) * 100
                }
                positive={monthTax >= lastMonthTax ? true : false}
                sx={{ height: "100%" }}
                value={`$${monthTax}k`}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={4}>
              <OverviewTotalCustomers
                difference={
                  lastMonthCategories == 0
                    ? 100
                    : Math.abs(monthCategories / lastMonthCategories - 1) * 100
                }
                positive={monthCategories >= lastMonthCategories ? true : false}
                sx={{ height: "100%" }}
                value={3}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={4}>
              <OverviewTotalProfit sx={{ height: "100%" }} value={`$${totalTaxByCurrentYear}`} />
            </Grid>

            <Grid xs={12} lg={8}>
              <OverviewSales chartSeries={barChart} sx={{ height: "100%" }} />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewTraffic
                chartSeries={pieChart.map((ele) => {
                  return {
                    percent: ele.percent,
                    totalTax: ele.totalTax,
                  };
                })}
                labels={pieChart.map((ele) => ele.name)}
                sx={{ height: "100%" }}
              />
            </Grid>
          </Grid>
        </Container>
        <Snackbar
          open={openToast}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={handleCloseToast}
        >
          <Alert
            severity="success"
            variant="standard"
            sx={{ width: "100%" }}
            onClose={handleCloseToast}
          >
            Tải lên file excel thành công
          </Alert>
        </Snackbar>
        <Snackbar
          open={openToastFail}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={handleCloseToast}
        >
          <Alert
            severity="error"
            variant="standard"
            sx={{ width: "100%" }}
            onClose={handleCloseToast}
          >
            Vui lòng upload file excel
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
