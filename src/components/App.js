import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";

const initialState = {
  questions: [],
  // There are some states throught our app, Loading, error, ready, active, and finished. So we will be using these values, This has nothing to do with the useReducer hook.
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataRecived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    case "start":
      return {
        ...state,
        status: "active",
      };

    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          question.correctOption === action.payload
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "end":
      return { ...state, status: "finished" };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };
    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(function () {
    fetch("http://localhost:8000/questions").then((res) => {
      res
        .json()
        .then((data) => {
          dispatch({
            type: "dataRecived",
            payload: data,
          });
        })
        .catch((err) => {
          dispatch({
            type: "dataFailed",
          });
        });
    });
  }, []);

  const numQuestions = state.questions.length;
  const totalPoints = state.questions.reduce((accumulator, obj) => {
    return accumulator + obj.points;
  }, 0);

  return (
    <div>
      <Header />
      <Main>
        {state.status === "loading" && <Loader></Loader>}
        {state.status === "error" && <Error></Error>}
        {state.status === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch}
          ></StartScreen>
        )}
        {state.status === "active" && (
          <>
            <Progress
              index={state.index}
              numQuestions={numQuestions}
              points={state.points}
              totalPoints={totalPoints}
              answer={state.answer}
            ></Progress>
            <Question
              question={state.questions[state.index]}
              dispatch={dispatch}
              answer={state.answer}
            ></Question>
            <NextButton
              dispatch={dispatch}
              answer={state.answer}
              index={state.index}
              numQuestions={numQuestions}
            ></NextButton>
          </>
        )}
        {state.status === "finished" && (
          <FinishScreen
            points={state.points}
            totalPoints={totalPoints}
            dispatch={dispatch}
          ></FinishScreen>
        )}
      </Main>
    </div>
  );
}
