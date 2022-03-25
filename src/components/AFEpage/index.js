import React from "react";
import useStyles from "./styles";
import {
  Container,
  Typography,
  Grid,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

function AFEpage() {
  const classes = useStyles();
  const isActive = useMediaQuery("(max-width: 600px)");
  return (
    <>
      <Container maxWidth="lg">
        <Grid className={classes.Grid_Space}>
          <Grid>
            <img
              src={require("./asset/amazon.png")}
              alt="Closing The Gender Gap in Technology"
            />
          </Grid>
          <Grid>
            <img
              src={require("./asset/futurengineer.png")}
              alt="Closing The Gender Gap in Technology"
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={!isActive ? 3 : 4}
          className={classes.Grid_Space}
        >
          <Grid item xs={12} sm={6} md={6}>
            <img
              className={classes.IMG}
              src={require("./asset/First-img.svg")}
              alt="Closing The Gender Gap in Technology"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Typography variant="body1" paragraph>
              India’s tech industry employs 10 million people; however, women
              only make up 34% of the workforce. Women represent 40% of
              entry-level tech jobs & the representation gets lower as they move
              up with 30% at the mid-level positions and as low as 20% in senior
              roles.
            </Typography>

            <Typography variant="body1" paragraph>
              To reduce the gender gap in technology and equip them with CS
              readiness skills, we work with young women from underserved
              communities.
            </Typography>
          </Grid>
        </Grid>
        <Grid className={classes.Hadings}>
          <Typography
            gutterbottom
            variant="h5"
            align={isActive ? "center" : "left"}
          >
            Our Mission
          </Typography>
        </Grid>

        <Grid
          container
          spacing={!isActive ? 3 : 4}
          className={classes.Grid_Space}
        >
          <Grid item xs={12} sm={6} md={6} order={{ xs: 2, sm: 1 }}>
            <Typography variant="body1" paragraph>
              NavGurukul is a registered non-profit organization working towards
              the financial empowerment of students from underserved
              communities. Started in 2016 by IIT-D Alumnus, the organization
              equips the youth with 21st-century skills through programming,
              coding, critical thinking, and problem-solving with a commitment
              to support its students until their placements.
            </Typography>

            <Typography variant="body1" paragraph>
              Navgurukul offers a 1-year fully-funded skilling and recruitment
              program in software engineering that enables them to secure
              aspirational careers.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={6} order={{ xs: 1, sm: 2 }}>
            <img
              className={classes.IMG}
              src={require("./asset/Second-img.svg")}
              alt="Students Img"
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={!isActive ? 3 : 4}
          className={classes.Grid_Space}
        >
          <Grid item xs={12} sm={6} md={6}>
            <img
              className={classes.IMG}
              src={require("./asset/Second-img.svg")}
              alt="Students Img"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Grid className={classes.Hadings}>
              <Typography
                gutterbottom
                variant="h5"
                align={isActive ? "center" : "left"}
              >
                Our Approach
              </Typography>
            </Grid>
            <Typography variant="body1" paragraph align="left">
              Navgurukul is working with a two-step approach to make our
              students CS ready and placed in tech jobs.
              <List>
                <ListItem>
                  <Grid className={classes.AFE_approaches}>
                    <FiberManualRecordIcon
                      fontSize="10px"
                      className={classes.Fiber_space}
                    />
                    Accessibility and readiness program: Meraki
                    <ListItemText className={classes.Approaches_text}>
                      Age group: 13+ girls/ women
                    </ListItemText>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid className={classes.AFE_approaches}>
                    <FiberManualRecordIcon
                      className={classes.Fiber_space}
                      fontSize="Small"
                    />
                    Skilling and job placement program: Residential Program
                    <ListItemText className={classes.Approaches_text}>
                      Age group 18 - 29 years
                    </ListItemText>
                  </Grid>
                </ListItem>
              </List>
            </Typography>
          </Grid>
        </Grid>

        <Grid spacing={8} align="center" className={classes.Ng_AFE}>
          {!isActive ? (
            <Typography gutterbottom variant="h5">
              NavGurukul 🤝 Amazon Future Engineer
            </Typography>
          ) : (
            <Typography gutterbottom variant="h5">
              NavGurukul 🤝 AFE
            </Typography>
          )}
        </Grid>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          className={classes.Grid_Space}
        >
          <Grid iteam xs={isActive ? 11 : 8}>
            <Typography variant="body1" paragraph>
              Amazon Future Engineer (AFE) is a comprehensive
              childhood-to-career program to increase access to computer science
              education for children and young adults who typically lack these
              opportunities.
            </Typography>
            <Typography variant="body1" paragraph>
              To take its mission forward in India, AFE has partnered with
              Navguruku in its Meraki program to close the gender gap in
              technology. Meraki is an android application focused on making
              programming and digital skills accessible to learners from
              different communities through a smartphone to create direct job
              opportunities or admissions to aspirational training programs. The
              focus area is young women and girls to bridge the gender gap in
              the digital literacy sector.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
export default AFEpage;

// import React from "react";
// import "./styles.scss";

// function AFEpage() {
//   return (
//     <div className="AFE-container">
//       <div className="amazon_logo">
//         <img src={require("../../asset/amazon_logo.png")} />
//       </div>
//       <div className="AFE-section">
//         <h2 className="AFE-title">Closing the gender gap in technology</h2>
//         <div className="AFE-details">
//           <p>
//             India’s tech industry employs 10 million people; however, women only
//             make up 34% of the workforce. Women represent 40% of entry-level
//             tech jobs & the representation gets lower as they move up with 30%
//             at the mid-level positions and as low as 20% in senior roles.
//           </p>
//           <p>
//             To reduce the gender gap in technology and equip them with CS
//             readiness skills, we work with young women from underserved
//             communities.
//           </p>
//         </div>
//         <div className="AFE-details">
//           <h2 className="heading">Our Mission</h2>
//           <p>
//             NavGurukul is a registered non-profit organization working towards
//             the financial empowerment of students from underserved communities.
//             Started in 2016 by IIT-D Alumnus, the organization equips the youth
//             with 21st-century skills through programming, coding, critical
//             thinking, and problem-solving with a commitment to support its
//             students until their placements.
//           </p>
//           <p>
//             Navgurukul offers a 1-year fully-funded skilling and recruitment
//             program in software engineering that enables them to secure
//             aspirational careers.
//           </p>
//         </div>
//         <div className="AFE-details">
//           <h2 className="heading">Our Approach</h2>
//           <p>
//             Navgurukul is working with a two-step approach to make our students
//             CS ready and placed in tech jobs.
//             <ul>
//               <li>
//                 <div className="AFE-approaches-title">
//                   Accessibility and readiness program: Meraki
//                 </div>
//                 Age group: 13+ girls/ women
//               </li>
//               <li>
//                 <div className="AFE-approaches-title">
//                   Skilling and job placement program: Residential Program
//                 </div>
//                 Age group 18 - 29 years
//               </li>
//             </ul>
//           </p>
//         </div>
//         <div className="AFE-details">
//           <h2 className="heading">NavGurukul 🤝 Amazon Future Engineer</h2>
//           <p>
//             Amazon Future Engineer (AFE) is a comprehensive childhood-to-career
//             program to increase access to computer science education for
//             children and young adults who typically lack these opportunities.
//           </p>
//           <p>
//             To take its mission forward in India, AFE has partnered with
//             Navguruku in its Meraki program to close the gender gap in
//             technology. Meraki is an android application focused on making
//             programming and digital skills accessible to learners from different
//             communities through a smartphone to create direct job opportunities
//             or admissions to aspirational training programs. The focus area is
//             young women and girls to bridge the gender gap in the digital
//             literacy sector.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AFEpage;
