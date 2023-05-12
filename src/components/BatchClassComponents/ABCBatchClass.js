import React, { useEffect, useState } from "react";
import axios from "axios";
import { METHODS } from "../../services/api";
import { format } from "../../common/date";
import { useSelector } from "react-redux";
import ClassJoinTimerButton from "../../components/Class/ClassJoinTimerButton";
import {
  Typography,
  Grid,
  Button,
  Container,
  Card,
  CardContent,
  Chip,
  CardActions,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import useStyles from "./styles";
import { breakpoints } from "../../theme/constant";
import useMediaQuery from "@mui/material/useMediaQuery";
import DoubtClassCard from "./DoubtClassCard";

function ABCBatchClass({ enrolledBatches }) {
  const isActive = useMediaQuery("(max-width:" + breakpoints.values.sm + "px)");
  const classes = useStyles();
  const [enrollClasses, setEnrollClasses] = useState([]);
  const [doubtclasses, setDoubtclasses] = useState([]);
  const user = useSelector(({ User }) => User);

  useEffect(() => {
    axios({
      method: METHODS.GET,
      url: `${process.env.REACT_APP_MERAKI_URL}/pathways/7/userEnrolledClasses`,
      headers: {
        accept: "application/json",
        Authorization: user.data.token,
      },
    }).then((res) => {
      setEnrollClasses(res.data);
    });
  }, []);

  // /pathways/doubtclasses/{pathway_id}'

  useEffect(() => {
    axios({
      method: METHODS.GET,
      url: `${process.env.REACT_APP_MERAKI_URL}/pathways/doubtclasses/7`,
      headers: {
        accept: "application/json",
        Authorization: user.data.token,
      },
    }).then((res) => {
      setDoubtclasses(res.data);
      console.log(res, "ham aapke kon");
    });
  }, []);

  return (
    <>
      <Grid
        container
        bgcolor="#E9F5E9"
        justifyContent="space-between"
        sx={
          isActive
            ? { padding: "32px 16px" }
            : { padding: "22px 80px 22px 80px" }
        }
      >
        <Grid item>
          <Typography variant="h6" marginTop="8px">
            {enrolledBatches}
          </Typography>
        </Grid>
        <Grid item justifyContent="right">
          <Button startIcon={<SettingsIcon />} color="inherit">
            Preferences
          </Button>
        </Grid>
      </Grid>
      <Container maxWidth="lg">
        <Typography variant="h6" sx={{ margin: "32px 0px" }}>
          Live Classes
        </Typography>
        <Grid container>
          <Grid item md="4px">
            <Chip
              label="Upcoming Class"
              color="secondary"
              sx={{ transform: "rotate(-4.29deg)", marginLeft: "8px" }}
            />
            <Card
              sx={{
                padding: "32px 16px",
                maxWidth: "384px",
                background: "#FAFAFA",
              }}
              elevation={1}
            >
              <CardContent>
                <Grid container>
                  <Grid item sm={2}>
                    <img
                      // className={classes.icons}
                      src={require("./assets/playButton.svg")}
                      alt="Students Img"
                    />
                  </Grid>
                  <Grid item md={10} sm={8} xs={8}>
                    <Typography marginLeft="16px" variant="subtitle1">
                      Foundations of Data Structures and Algorithms
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container mt="32px">
                  <Grid item md={7} xs={7} sx={{ display: "flex" }}>
                    <DateRangeIcon />
                    <Typography variant="body1" ml="8px">
                      25 May 2023
                    </Typography>
                  </Grid>
                  <Grid display="flex">
                    <AccessTimeIcon />
                    <Typography variant="body1" marginLeft="8px">
                      2 PM
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions sx={{ justifyContent: "right" }}>
                <Button disabled endIcon={<ArrowForwardIcon />}>
                  Starts in 1 hour
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        <Container className={classes.cardGrid} maxWidth="lg">
          <Grid container spacing={isActive ? 2 : 4}>
            {enrollClasses.map((item, index) => (
              <Grid item xs={12} ms={6} md={4}>
                {index === 0 && (
                  <Chip
                    label="Upcoming Class"
                    color="secondary"
                    sx={{
                      transform: "rotate(-4.29deg)",
                      marginLeft: "8px",
                      position: "absolute",
                      // top: "0",
                    }}
                  />
                )}
                <Card
                  sx={{
                    padding: "32px 16px",
                    maxWidth: "384px",
                    background: "#FAFAFA",
                    background: index === 0 ? "#E9F5E9" : "#FAFAFA",
                  }}
                  elevation={1}
                >
                  <CardContent>
                    <Grid container>
                      <Grid item sm={2}>
                        <img
                          // className={classes.icons}
                          src={require("./assets/playButton.svg")}
                          alt="Students Img"
                        />
                      </Grid>
                      <Grid item md={10} sm={8} xs={8}>
                        <Typography marginLeft="16px" variant="subtitle1">
                          {item.title}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container mt="32px">
                      <Grid item md={7} xs={7} sx={{ display: "flex" }}>
                        <DateRangeIcon />
                        <Typography variant="body1" ml="8px">
                          {format(item.start_time, "dd MMM yy")}
                        </Typography>
                      </Grid>
                      <Grid display="flex">
                        <AccessTimeIcon />
                        <Typography variant="body1" marginLeft="8px">
                          {/* 2 PM */}
                          {format(item.start_time, "hh:mm aaa")}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "right" }}>
                    <Button endIcon={<ArrowForwardIcon />}>
                      <ClassJoinTimerButton
                        buttonType="text"
                        startTime={item?.start_time}
                        link={item?.meet_link}
                      />
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {doubtclasses && (
          <Typography variant="h6" margin="32px 0px">
            Doubt Class
          </Typography>
        )}

        <Grid container spacing={isActive ? 2 : 4}>
          {doubtclasses?.map((item, index) => (
            <DoubtClassCard item={item} setDoubtclasses={setDoubtclasses} />
          ))}
        </Grid>
        {/* <Grid container>
          <Grid item md="4px">
            <Card
              sx={{
                padding: "32px 16px",
                maxWidth: "384px",
                background: "#FFF5CC",
              }}>
              <CardContent>
                <Grid container>
                  <Grid item>
                    <img
                      // className={classes.icons}
                      src={require("./assets/playButton.svg")}
                      alt="Students Img"
                    />
                  </Grid>
                  <Grid item md={10} xs={8}>
                    <Typography marginLeft="16px" variant="subtitle1">
                      Foundations of Data Structures and Algorithms
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container mt="32px">
                  <Grid item md={7} sx={{ display: "flex" }}>
                    <DateRangeIcon />
                    <Typography variant="body1" ml="8px">
                      25 May 2023
                    </Typography>
                  </Grid>
                  <Grid display="flex">
                    <AccessTimeIcon />
                    <Typography variant="body1" marginLeft="8px">
                      2 PM
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions sx={{ justifyContent: "right" }}>
                <Button disabled endIcon={<ArrowForwardIcon />}>
                  Starts in 1 hour
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid> */}
      </Container>
    </>
  );
}

export default ABCBatchClass;
