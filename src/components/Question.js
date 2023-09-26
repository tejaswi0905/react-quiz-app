import Options from "./Options";
function Question({ question, dispatch, answer }) {
  return (
    <div>
      <h4>{question.question}</h4>
      <div className="options">
        <Options
          question={question}
          dispatch={dispatch}
          answer={answer}
        ></Options>
      </div>
    </div>
  );
}

export default Question;
