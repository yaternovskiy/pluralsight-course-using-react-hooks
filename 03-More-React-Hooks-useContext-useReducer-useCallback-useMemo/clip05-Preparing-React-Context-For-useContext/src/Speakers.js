import React, {useState, useEffect, useContext, useReducer, useCallback, useMemo} from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "../static/site.css";
import { Header } from "../src/Header";
import { Menu } from "../src/Menu";
import SpeakerData from "./SpeakerData";
import SpeakerDetail from "./SpeakerDetail";

import {ConfigContext} from "./App";

const speakersReducer = (state, action) => {
  const {type, payload} = action;

  switch(type){
    case 'setSpeakerList':
      return {
        ...state,
        speakerList: [...payload]
      };
    case 'setSpeakingSaturday':
      return  {
        ...state,
        speakingSaturday: !state.speakingSaturday
      };
    case 'setSpeakingSunday':
      return  {
        ...state,
        setSpeakingSunday: !state.setSpeakingSunday
      };
    case 'switchFavorite':
      return {
        ...state,
        speakerList: state.speakerList.map(item => {
          if (item.id === payload.sessionId) {
            item.favorite = payload.favoriteValue;
            return item;
          }
          return item;
        })
      };
    case 'setIsLoading':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  speakerList: [],
  speakingSunday: true,
  speakingSaturday: true,
  isLoading: true,
};

const Speakers = () => {
  const [speakingSaturday, setSpeakingSaturday] = useState(false);
  const [speakingSunday, setSpeakingSunday] = useState(true);
  // const [speakerList, setSpeakerList] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  const [state, dispatch] = useReducer(speakersReducer, initialState);

  const config = useContext(ConfigContext);

  useEffect(() => {
    dispatch({type: 'setIsLoading', payload: true});
    new Promise(function(resolve) {
      setTimeout(function() {
        resolve();
      }, 1000);
    }).then(() => {
      dispatch({type: 'setIsLoading', payload: false});
      const speakerListServerFilter = SpeakerData.filter(({ sat, sun }) => {
        return (state.speakingSaturday && sat) || (state.speakingSunday && sun);
      });
      dispatch({type: 'setSpeakerList', payload: speakerListServerFilter});
    });
    return () => {
      console.log("cleanup");
    };
  }, []); // [speakingSunday, speakingSaturday]);

  const handleChangeSaturday = () => setSpeakingSaturday(!speakingSaturday);
  const handleChangeSunday = () => setSpeakingSunday(!speakingSunday);
  // const handleChangeSunday = () => dispatch({type: 'setSpeakingSunday'});
  // const handleChangeSaturday = () => dispatch({type: 'setSpeakingSaturday'});

  const newSpeakerList = useMemo(() => {
    console.log('Memoized filter-sort called');
    return state.speakerList
            .filter(
                ({ sat, sun }) => (speakingSaturday && sat) || (speakingSunday && sun)
            )
            .sort(function(a, b) {
              if (a.firstName < b.firstName) {
                return -1;
              }
              if (a.firstName > b.firstName) {
                return 1;
              }
              return 0;
            })
    }
  , [speakingSaturday, speakingSunday]);

  const speakerListFiltered = state.isLoading
    ? []
    : newSpeakerList;

  const heartFavoriteHandler = useCallback((e, favoriteValue) => {
    e.preventDefault();
    const sessionId = parseInt(e.target.attributes["data-sessionid"].value);
    dispatch({
      type: 'switchFavorite',
      payload: {sessionId, favoriteValue}
    });
    //console.log("changing session favorte to " + favoriteValue);
  }, []);

  if (state.isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <Menu />
      <div className="container">
          {config.showSpeakerSpeakingDays &&
          (
              <div className="btn-toolbar  margintopbottom5 checkbox-bigger">
                  <div className="hide">
                      <div className="form-check-inline">
                          <label className="form-check-label">
                              <input
                                  type="checkbox"
                                  className="form-check-input"
                                  onChange={handleChangeSaturday}
                                  checked={speakingSaturday}
                              />
                              Saturday Speakers
                          </label>
                      </div>
                      <div className="form-check-inline">
                          <label className="form-check-label">
                              <input
                                  type="checkbox"
                                  className="form-check-input"
                                  onChange={handleChangeSunday}
                                  checked={speakingSunday}
                              />
                              Sunday Speakers
                          </label>
                      </div>
                  </div>
              </div>

          )}
        <div className="row">
          <div className="card-deck">
            {speakerListFiltered.map(
              ({ id, firstName, lastName, bio, favorite }) => {
                return (
                  <SpeakerDetail
                    key={id}
                    id={id}
                    favorite={favorite}
                    onHeartFavoriteHandler={heartFavoriteHandler}
                    firstName={firstName}
                    lastName={lastName}
                    bio={bio}
                  />
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speakers;
