import { createStore } from "redux";

const storageKey = "resume-builder-data";

const emptyResume = {
  profile: { fname: "", lname: "", phone: "", address: "", url: "" },
  education: [{ courseName: "", completionYear: "", college: "", percentage: "" }],
  skills: [{ skill: "" }],
  projects: [{ projectName: "", techStack: "", description: "" }],
  social: [{ value: "" }],
  savedAt: null,
};

const loadResume = () => {
  try {
    const saved = window.localStorage.getItem(storageKey);
    return saved ? { ...emptyResume, ...JSON.parse(saved) } : emptyResume;
  } catch (error) {
    return emptyResume;
  }
};

export const reducer = (state = emptyResume, action) => {
  switch (action.type) {
    case "UPDATE_PROFILE":
      return { ...state, profile: { ...state.profile, [action.field]: action.value } };
    case "UPDATE_ENTRY":
      return {
        ...state,
        [action.section]: state[action.section].map((entry, index) =>
          index === action.index ? { ...entry, [action.field]: action.value } : entry
        ),
      };
    case "ADD_ENTRY":
      return { ...state, [action.section]: [...state[action.section], action.entry] };
    case "DELETE_ENTRY":
      return {
        ...state,
        [action.section]: state[action.section].filter((entry, index) => index !== action.index),
      };
    case "LOAD_RESUME":
      return { ...emptyResume, ...action.resume };
    case "MARK_SAVED":
      return { ...state, savedAt: action.savedAt };
    default:
      return state;
  }
};

const store = createStore(reducer, loadResume());

export const persistResume = (resume) => {
  window.localStorage.setItem(storageKey, JSON.stringify(resume));
};

export default store;