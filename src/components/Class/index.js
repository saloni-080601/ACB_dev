import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import _ from "lodash";
import { toast } from "react-toastify";
import axios from "axios";

import { TIME_CONSTANT, CLASS_FIELDS } from "./constant";
import Loader from "../common/Loader";
import Form from "../common/form";
import { METHODS } from "../../services/api";
import "./styles.scss";

const {
  TITLE,
  DESCRIPTION,
  FACILITATOR_EMAIL,
  FACILITATOR_NAME,
  START_TIME,
  CLASS_START_TIME,
  CLASS_END_TIME,
  LANG,
  TYPE,
  COURSE_ID,
  EXERCISE_ID,
  MAX_ENROLMENT,
  FREQUENCY,
  ON_DAYS,
  OCCURRENCE,
  UNTIL,
} = CLASS_FIELDS;

function Class({ classToEdit }) {
  const isEditMode = !_.isEmpty(classToEdit);
  const [loading, setLoading] = useState(false);
  const [pathwayId, setPathwayId] = useState();

  const {
    title,
    description,
    facilitator,
    lang,
    type,
    start_time,
    end_time,
    course_id,
    exercise_id,
    max_enrolment,
    frequency,
    on_days,
    occurrence,
    until,
  } = classToEdit;

  const initialFormState = useMemo(() => {
    return {
      [TITLE]: title || "",
      [DESCRIPTION]: description || "",
      [FACILITATOR_NAME]: facilitator ? facilitator.name : "",
      [FACILITATOR_EMAIL]: facilitator ? facilitator.email : "",
      [START_TIME]: start_time
        ? moment.utc(start_time).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD"),
      [CLASS_START_TIME]: start_time
        ? moment.utc(start_time).add(330, "minute").format("kk:mm")
        : moment().format("kk:mm"),
      [CLASS_END_TIME]: end_time
        ? moment.utc(end_time).add(330, "minute").format("kk:mm")
        : moment().add(60, "minute").format("kk:mm"),
      [LANG]: lang || "hi",
      [TYPE]: type || "doubt_class",
      [COURSE_ID]: course_id || "",
      [EXERCISE_ID]: exercise_id || "",
      [MAX_ENROLMENT]: max_enrolment || "",
      [FREQUENCY]: frequency || "",
      [ON_DAYS]: on_days || [],
      [OCCURRENCE]: occurrence || "",
      [UNTIL]: until || "",
    };
  }, [classToEdit]);

  const user = useSelector(({ User }) => User);
  const rolesList = user.data.user.rolesList;

  const canSpecifyFacilitator =
    rolesList.indexOf("classAdmin") > -1 || rolesList.indexOf("admin") > -1;

  const [pathways, setPathways] = useState([]);
  const [exercisesForSelectedCourse, setExercisesForSelectedCourse] = useState(
    {}
  );

  const editClass = (payload) => {
    if (classToEdit.type === "cohort") {
      delete payload.frequency;
    }

    setLoading(true);
    return axios({
      method: METHODS.PUT,
      url: `${process.env.REACT_APP_MERAKI_URL}/apiDocs/classes/${classToEdit.id}`,
      headers: {
        accept: "application/json",
        Authorization: user.data.token,
      },
      data: payload,
    }).then(
      () => {
        toast.success("Updated class details!", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 2500,
        });
        setLoading(false);
      },
      (error) => {
        toast.error(
          `Something went wrong with error status: ${error.response.status} ${error.response.data.message}`,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    axios({
      method: METHODS.GET,
      url: `${process.env.REACT_APP_MERAKI_URL}/pathways`,
      headers: {
        accept: "application/json",
        Authorization: user.data.token,
      },
    }).then((res) => {
      setPathways(res.data.pathways);
    });
  }, []);

  const onCourseChange = (courseId) => {
    if (exercisesForSelectedCourse[courseId]) {
      return;
    }
    axios({
      method: METHODS.GET,
      url: `${process.env.REACT_APP_MERAKI_URL}/courses/${courseId}/exercises`,
      headers: {
        accept: "application/json",
        Authorization: user.data.token,
      },
    }).then((res) => {
      setExercisesForSelectedCourse({
        ...exercisesForSelectedCourse,
        [courseId]: res.data.course.exercises,
      });
    });
  };

  const handleTimeValidationAndCreateClass = (payload) => {
    const classStartTime = moment(
      `${payload[TIME_CONSTANT.CLASS_START_DATE]} ${
        payload[TIME_CONSTANT.CLASS_START_TIME]
      }`
    );
    const classEndTime = moment(
      `${payload[TIME_CONSTANT.CLASS_START_DATE]} ${
        payload[TIME_CONSTANT.CLASS_END_TIME]
      }`
    );
    if (classStartTime.valueOf() >= classEndTime.valueOf()) {
      toast.error("Class end time must be later than class start time.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      // Making the class end time field focused, so user can edit it.
      return document.getElementById(TIME_CONSTANT.CLASS_END_TIME).focus();
    }
    // remove the unnecessary time fields and add date parameter
    delete payload[TIME_CONSTANT.CLASS_END_TIME];
    delete payload[TIME_CONSTANT.CLASS_START_TIME];
    payload[TIME_CONSTANT.CLASS_START_DATE] = `${moment(classStartTime).format(
      "YYYY-MM-DDTHH:mm:ss"
    )}Z`;
    payload[TIME_CONSTANT.CLASS_END_DATE] = `${moment(classEndTime).format(
      "YYYY-MM-DDTHH:mm:ss"
    )}Z`;

    if (!isEditMode) {
      createClass(payload);
    } else {
      editClass(payload);
    }
  };

  const changeHandler = async (e, setField, field) => {
    if (e.target.name === "occurrence") {
      setField({ ...field, [e.target.name]: e.target.value, until: "" });
    } else if (e.target.name === "until") {
      setField({
        ...field,
        [e.target.name]: e.target.value,
        occurrence: "",
      });
    } else {
      setField({ ...field, [e.target.name]: e.target.value });
    }
  };

  const checkBoxHandler = (e, day, key, field, setField) => {
    if (e.target.checked === true) {
      const daysList = [...field[key], day];
      setField(daysList, key);
    } else {
      _.remove(field[key], function (del) {
        return del === day;
      });
    }
  };

  const createClass = (payload) => {
    setLoading(true);
    return axios({
      url: `${process.env.REACT_APP_MERAKI_URL}/classes`,
      method: METHODS.POST,
      headers: {
        accept: "application/json",
        Authorization: user.data.token,
      },
      data: {
        ...payload,
      },
    }).then(
      () => {
        toast.success("You successfully created a class.", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        setLoading(false);
      },
      (error) => {
        toast.error(
          `Something went wrong with error status: ${error.response.status} ${error.response.data.message}`,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
        setLoading(false);
      }
    );
  };
  const onFormSubmit = (event) => {
    event && event.preventDefault();
    const formData = new FormData(event.target);
    let formFields = {
      category_id: 3,
    };

    for (let [fieldName, value] of formData.entries()) {
      if (value) {
        if (fieldName === "max_enrolment") {
          formFields[fieldName] = Number(value);
        } else if (fieldName === "type") {
          if (value === "cohort") {
            formFields = { ...formFields, type: "cohort", frequency: "WEEKLY" };
          } else {
            formFields[fieldName] = value;
          }
        } else if (fieldName === "on_days") {
          formFields[fieldName] = value.split(",");
        } else {
          formFields[fieldName] = value;
        }
      }
    }
    handleTimeValidationAndCreateClass(formFields);
  };

  return (
    <div className="ng-create-class">
      <h2 className="title">
        {isEditMode ? "Update class" : "Create Cohort / Single Class"}
      </h2>
      <Form
        className="form"
        onSubmit={onFormSubmit}
        initialFieldsState={initialFormState}
      >
        {({ formFieldsState, setFormField, setFormFieldsState }) => {
          return (
            <>
              <label htmlFor="type">Select Class Type</label>
              <span>
                <label htmlFor="type">
                  <input
                    type="radio"
                    className="radio-field"
                    name={TYPE}
                    onChange={(e) => {
                      setFormField("doubt_class", TYPE);
                    }}
                    value={formFieldsState[TYPE]}
                    id="type1"
                  />
                  Doubt Class
                </label>
                <label htmlFor="type">
                  <input
                    type="radio"
                    className="radio-field"
                    name={TYPE}
                    onChange={(e) => {
                      setFormField("workshop", TYPE);
                    }}
                    value={formFieldsState[TYPE]}
                    id="type2"
                  />
                  Workshop
                </label>
                <label htmlFor="type">
                  <input
                    type="radio"
                    className="radio-field"
                    name={TYPE}
                    onChange={(e) => {
                      setFormField("cohort", TYPE);
                    }}
                    value={formFieldsState[TYPE]}
                    id="type3"
                  />
                  Cohort
                </label>
              </span>
              <label htmlFor="title" className="label-field">
                Title
              </label>
              <input
                className="input-field"
                type="text"
                name={TITLE}
                onChange={(e) =>
                  changeHandler(e, setFormFieldsState, formFieldsState)
                }
                value={formFieldsState[TITLE]}
                id="title"
                required
                aria-required
              />
              <label htmlFor="description" className="label-field">
                Description
              </label>
              <textarea
                name={DESCRIPTION}
                rows="10"
                id="description"
                onChange={(e) =>
                  changeHandler(e, setFormFieldsState, formFieldsState)
                }
                value={formFieldsState[DESCRIPTION]}
                className="textarea-field"
                required
                aria-required
              />
              {canSpecifyFacilitator && (
                <>
                  <label htmlFor="facilitator_name" className="label-field">
                    Facilitator Name
                  </label>
                  <input
                    className="input-field"
                    type="text"
                    name={FACILITATOR_NAME}
                    value={formFieldsState[FACILITATOR_NAME]}
                    onChange={(e) =>
                      changeHandler(e, setFormFieldsState, formFieldsState)
                    }
                    id="facilitator_name"
                    disabled={isEditMode ? true : false}
                  />
                  <label htmlFor="facilitator_email" className="label-field">
                    Facilitator Email
                  </label>
                  <input
                    className="input-field"
                    type="email"
                    value={formFieldsState[FACILITATOR_EMAIL]}
                    onChange={(e) =>
                      changeHandler(e, setFormFieldsState, formFieldsState)
                    }
                    name={FACILITATOR_EMAIL}
                    id="facilitator_email"
                    disabled={isEditMode ? true : false}
                  />
                </>
              )}
              <label htmlFor="start_time" className="label-field">
                Date
              </label>
              <input
                className="input-field input-field--short"
                type="date"
                name={START_TIME}
                value={formFieldsState[START_TIME]}
                onChange={(e) =>
                  changeHandler(e, setFormFieldsState, formFieldsState)
                }
                id="start_time"
                required
                aria-required
              />
              <label htmlFor="class_start_time" className="label-field">
                Start Time
              </label>
              <input
                className="input-field input-field--short"
                type="time"
                name={CLASS_START_TIME}
                onChange={(e) =>
                  changeHandler(e, setFormFieldsState, formFieldsState)
                }
                value={formFieldsState[CLASS_START_TIME]}
                id="class_start_time"
                required
                aria-required
              />
              <label htmlFor="class_end_time" className="label-field">
                End Time
              </label>
              <input
                className="input-field input-field--short"
                type="time"
                name={CLASS_END_TIME}
                onChange={(e) =>
                  changeHandler(e, setFormFieldsState, formFieldsState)
                }
                value={formFieldsState[CLASS_END_TIME]}
                id="class_end_time"
                required
                aria-required
              />
              <label htmlFor="lang" className="label-field">
                Select Language
              </label>
              <span>
                <label htmlFor="lang">
                  <input
                    type="radio"
                    className="radio-field"
                    name={LANG}
                    onChange={(e) => {
                      setFormField("en", LANG);
                    }}
                    value={formFieldsState[LANG]}
                    id="lang"
                  />
                  English
                </label>
                <label htmlFor="lang">
                  <input
                    type="radio"
                    className="radio-field"
                    name={LANG}
                    onChange={(e) => {
                      setFormField("hi", LANG);
                    }}
                    value={formFieldsState[LANG]}
                    id="lang"
                  />
                  Hindi
                </label>
                <label htmlFor="lang">
                  <input
                    type="radio"
                    className="radio-field"
                    name={LANG}
                    onChange={(e) => {
                      setFormField("te", LANG);
                    }}
                    value={formFieldsState[LANG]}
                    id="lang"
                  />
                  Telugu
                </label>
                <label htmlFor="lang">
                  <input
                    type="radio"
                    className="radio-field"
                    name={LANG}
                    onChange={(e) => {
                      setFormField("ta", LANG);
                    }}
                    value={formFieldsState[LANG]}
                    id="lang"
                  />
                  Tamil
                </label>
              </span>
              <label htmlFor="pathway" className="label-field">
                Select Pathway
              </label>
              <select
                className="input-field"
                value={pathwayId}
                required
                aria-required
                onChange={(e) => {
                  setPathwayId(e.target.value);
                }}
                id="pathway"
              >
                <option value="">Select a pathway from options below</option>
                {pathways.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              {pathwayId &&
                pathways.map((pathway) => {
                  if (pathwayId == pathway.id) {
                    return (
                      <React.Fragment key={pathway.id}>
                        <label htmlFor="course_id" className="label-field">
                          Select Course{" "}
                        </label>
                        <select
                          className="input-field"
                          required
                          aria-required
                          name={COURSE_ID}
                          value={formFieldsState[COURSE_ID]}
                          onChange={(e) => {
                            onCourseChange(e.target.value);
                            setFormField(e.target.value, COURSE_ID);
                          }}
                          id="course_id"
                        >
                          <option value="">Select a course</option>
                          {pathway.courses.map((course) => {
                            return (
                              <option key={course.id} value={course.id}>
                                {course.name}
                              </option>
                            );
                          })}
                        </select>
                      </React.Fragment>
                    );
                  }
                })}
              {formFieldsState[COURSE_ID] && exercisesForSelectedCourse && (
                <>
                  <label htmlFor="exercise_id" className="label-field">
                    Select Exercise
                    <span className="optional-field">(optional)</span>
                  </label>
                  <select
                    className="input-field"
                    name={EXERCISE_ID}
                    value={formFieldsState[EXERCISE_ID]}
                    onChange={(e) => {
                      setFormField(e.target.value, EXERCISE_ID);
                    }}
                    id="exercise_id"
                  >
                    <option value="">Select an exercise</option>
                    {(
                      exercisesForSelectedCourse[formFieldsState[COURSE_ID]] ||
                      []
                    ).map((exercise) => {
                      return (
                        <option key={exercise.id} value={exercise.id}>
                          {exercise.name}
                        </option>
                      );
                    })}
                  </select>
                </>
              )}
              <label htmlFor={MAX_ENROLMENT} className="label-field">
                Maximum Enrollments
                <span className="optional-field">(optional)</span>
                <br />
                <span className="description-for-enrollments">
                  This is specific to Spoken English Classes, to cap the
                  students per class between 5 - 10 <br />
                  so that you can provide individual attention to each student's
                  progress.
                </span>
              </label>
              <input
                className="input-field"
                type="number"
                name={MAX_ENROLMENT}
                id={MAX_ENROLMENT}
                onChange={(e) =>
                  changeHandler(e, setFormFieldsState, formFieldsState)
                }
                value={formFieldsState[MAX_ENROLMENT]}
                placeholder="Maximum students per class"
              />
              {formFieldsState[TYPE] === "cohort" && (
                <>
                  <label htmlFor="on_days" className="label-field">
                    On days
                  </label>
                  <spam>
                    <label htmlFor="on_days" for="on_days">
                      <input
                        type="checkbox"
                        className="checkbox-field"
                        name={ON_DAYS}
                        onClick={(e) =>
                          checkBoxHandler(
                            e,
                            "MO",
                            ON_DAYS,
                            formFieldsState,
                            setFormField
                          )
                        }
                        value={formFieldsState[ON_DAYS]}
                        id="on_days"
                        disabled={isEditMode ? true : false}
                      />
                      MO
                    </label>
                    <label htmlFor="on_days">
                      <input
                        type="checkbox"
                        className="checkbox-field"
                        name={ON_DAYS}
                        onClick={(e) =>
                          checkBoxHandler(
                            e,
                            "TU",
                            ON_DAYS,
                            formFieldsState,
                            setFormField
                          )
                        }
                        value={[...formFieldsState[ON_DAYS]]}
                        id="on_days"
                        disabled={isEditMode ? true : false}
                      />
                      TU
                    </label>
                    <label htmlFor="on_days">
                      <input
                        type="checkbox"
                        className="checkbox-field"
                        name={ON_DAYS}
                        onClick={(e) =>
                          checkBoxHandler(
                            e,
                            "WE",
                            ON_DAYS,
                            formFieldsState,
                            setFormField
                          )
                        }
                        value={[...formFieldsState[ON_DAYS]]}
                        id="on_days"
                        disabled={isEditMode ? true : false}
                      />
                      WE
                    </label>
                    <label htmlFor="on_days">
                      <input
                        type="checkbox"
                        className="checkbox-field"
                        name={ON_DAYS}
                        onClick={(e) =>
                          checkBoxHandler(
                            e,
                            "TH",
                            ON_DAYS,
                            formFieldsState,
                            setFormField
                          )
                        }
                        value={formFieldsState[ON_DAYS]}
                        id="on_days"
                        disabled={isEditMode ? true : false}
                      />
                      TH
                    </label>
                    <label htmlFor="on_days">
                      <input
                        type="checkbox"
                        className="checkbox-field"
                        name={ON_DAYS}
                        onClick={(e) =>
                          checkBoxHandler(
                            e,
                            "FR",
                            ON_DAYS,
                            formFieldsState,
                            setFormField
                          )
                        }
                        value={formFieldsState[ON_DAYS]}
                        id="on_days"
                        disabled={isEditMode ? true : false}
                      />
                      FR
                    </label>
                    <label htmlFor="on_days">
                      <input
                        type="checkbox"
                        className="checkbox-field"
                        name={ON_DAYS}
                        onClick={(e) =>
                          checkBoxHandler(
                            e,
                            "SA",
                            ON_DAYS,
                            formFieldsState,
                            setFormField
                          )
                        }
                        value={formFieldsState[ON_DAYS]}
                        id="on_days"
                        disabled={isEditMode ? true : false}
                      />
                      SA
                    </label>
                    <label htmlFor="on_days">
                      <input
                        type="checkbox"
                        className="checkbox-field"
                        name={ON_DAYS}
                        onClick={(e) =>
                          checkBoxHandler(
                            e,
                            "SU",
                            ON_DAYS,
                            formFieldsState,
                            setFormField
                          )
                        }
                        value={formFieldsState[ON_DAYS]}
                        id="on_days"
                        disabled={isEditMode ? true : false}
                      />
                      SU
                    </label>
                  </spam>
                  <label htmlFor={UNTIL} className="label-field">
                    Until
                    <span className="optional-field">(optional)</span>
                  </label>
                  <input
                    className="input-field input-field--short"
                    type="date"
                    data-date-format="YYYY MM DD"
                    name={UNTIL}
                    id={UNTIL}
                    onChange={(e) =>
                      changeHandler(e, setFormFieldsState, formFieldsState)
                    }
                    value={formFieldsState[UNTIL]}
                    placeholder="Until when recurring classes"
                    disabled={isEditMode ? true : false}
                  />
                  <label htmlFor={OCCURRENCE} className="label-field">
                    Occurrence
                    <span className="optional-field">(optional)</span>
                  </label>
                  <input
                    className="input-field"
                    type="number"
                    name={OCCURRENCE}
                    id={OCCURRENCE}
                    onChange={(e) =>
                      changeHandler(e, setFormFieldsState, formFieldsState)
                    }
                    value={formFieldsState[OCCURRENCE]}
                    placeholder="How many recurring classes"
                    disabled={isEditMode ? true : false}
                  />
                </>
              )}
              <button type="submit" className="submit" disabled={loading}>
                {loading ? (
                  <Loader />
                ) : isEditMode ? (
                  "UPDATE CLASS"
                ) : (
                  "Create Class"
                )}
              </button>
            </>
          );
        }}
      </Form>
    </div>
  );
}
export default Class;
