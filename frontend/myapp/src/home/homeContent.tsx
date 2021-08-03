import { useEffect, useState } from "react";
import axios from "axios";

import { Button, makeStyles } from "@material-ui/core";
import { Pagination } from '@material-ui/lab';

import { TimelineType } from "types/typeList";

import Timeline from "tweet/timeline";

const HomeContent = () => {
  console.log("!!HomeContent!!");
  const [data, setData] = useState<TimelineType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const useStyles = makeStyles({
    button: {
      alignItems: "center",
      display: "flex",
      margin: "0 auto",
      maxWidth: "800px",
      width: "100%"
    },
    pagination: {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      margin: "0 auto",
      maxWidth: "800px",

    }
  });
  const classes = useStyles();

  const getContents = () => {
    setPage(1);
    setData([]);
    const url = `http://localhost:3000`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      setData(res.data.home_data);

      const number = Math.ceil(res.data.home_data_count / 15);
      setPageNumber(number);
    }).catch(error => {
      console.log("There are something errors", error);
    });
  };
  useEffect(getContents, []);


  const handlePagination = (p: number) => {
    setPage(p);
    setData([]);
    const url = `http://localhost:3000/?page=${p}`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      setData(res.data.home_data);
    }).catch(error => {
      console.log("There are something errors", error);
    });
  };

  const MyPagination = () => {
    return (
      <Pagination
        className={classes.pagination}
        color="primary"
        count={pageNumber}
        onChange={(e, p) => handlePagination(p)}
        page={page}
        variant="outlined"
        shape="rounded" />
    );
  }

  return (
    <div>
      <Button className={classes.button} color="primary" onClick={getContents} variant="outlined">
        更新
      </Button>

      {data.toString() !== [].toString() &&
        <>
          <Timeline data={data} />
          <MyPagination />
        </>
      }
    </div>
  );
}

export default HomeContent;
