import React, {useContext, useEffect, useRef, useState} from "react";
import {Grid, Typography} from '@mui/material';
import {ThisOrThatProps} from "../../../types/props/RoundProps";
import {card, padding, questionWrapper} from "../../../styling/styles";
import {AnimatedPaper} from "../../../styling/animations";
import {addPlayerResponseToLocalStorage, getPlayersNotInGame} from "../../../gamelogic/answers";
import RoundTimer from "../../subcomponents/RoundTimer";
import {GameClass} from "../../../types/classes/GameClass";
import {PlayerScoreFromRound} from "../../../types/types/Player";
import AnimateVotes from "../../subcomponents/AnimateVotes"
import {getSocketConnection, useSocketOnHook} from "../../../services/socket";
import {useSpeechSynthesisHook} from "../../../services/speech";
import { roundContext} from "./RoundManager";

const socket = getSocketConnection();
const COMPONENT_WAIT = 4000; // How long to wait before component is "done"

const ThisOrThat: React.FC<ThisOrThatProps> = ({ players, onDone, game, votingTime, maxScore }) => {
    const [gameState, setGameState] = useState<GameClass>(game);
    const [isThisResponseShown, setIsThisResponseShown] = useState(false);
    const [isThatResponseShown, setIsThatResponseShown] = useState(false);
    const [playerScoresFromRound, setPlayerScoresFromRound] = useState<PlayerScoreFromRound[]>([]);
    const [isResultsShown, setIsResultsShown] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [receivedUserVotes, setReceivedUserVotes] = useState<string[]>([]);
    const playersVoted = useRef(0);

    const context = useContext(roundContext);

    const responses = game.getPlayerResponses();

    const messages = [
        game.getQuestion(),
        responses[0].response,
        responses[1].response
    ];

    useEffect(() => {
        socket.emit("join_specific_room", localStorage.getItem("roomCode"));
    }, []);

    const addVoteToNewGameState = (initialGameState: GameClass, data: any) => {
        playersVoted.current++;
        initialGameState.addVote(data.voterUsername, data.response);
        setReceivedUserVotes([...receivedUserVotes, data.voterUsername]);

        if (playersVoted.current >= getPlayersNotInGame(responses, players).length) {
            if (!(context && context.isFinalRound)) {
                const winnerPlayerResponse = game.getWinnerPlayerResponse();
                addPlayerResponseToLocalStorage(winnerPlayerResponse);
            }
            handleTimeEnd();
        }

        return initialGameState;
    }

    useSocketOnHook(socket, "receive_vote", (data) => {
            if (!receivedUserVotes.includes(data.voterUsername)) {
                setGameState(prevState => addVoteToNewGameState(prevState, data));
            }
        },
    );

    const onEndSpeech = (messageIndex: number) => {
        if (messageIndex === 0) setIsThisResponseShown(true);
        if (messageIndex === 1) setIsThatResponseShown(true);
    }

    const onDoneSpeech = () => {
        socket.emit("begin_voting", { game: game, players: getPlayersNotInGame(responses, players) });
        setShowTimer(true);
    }

    useSpeechSynthesisHook(
        messages,
        onEndSpeech,
        onDoneSpeech
    )

    const handleTimeEnd = () => {
        if (isResultsShown) return;
        socket.emit("time_end", localStorage.getItem("roomCode"));

        setShowTimer(false);

        const [newPlayers, playerScoresFromRound] = game.addScoreToPlayers(maxScore, players);
        localStorage.setItem("players", JSON.stringify(newPlayers));
        setPlayerScoresFromRound(playerScoresFromRound);
        setIsResultsShown(true);
        setTimeout(() => {
            onDone();
        }, COMPONENT_WAIT);
    }

    const animateVotes = (response: string) => {
        const foundPlayerScoreFromRound = playerScoresFromRound
            .find(player => player.playerResponse.response === response);

        if (!foundPlayerScoreFromRound) return null;

        console.log(foundPlayerScoreFromRound);

        return (
            <AnimateVotes playerScoreFromRound={foundPlayerScoreFromRound} players={players}/>
        );
    }

    return (
        <div style={card}>
            <AnimatedPaper elevation={3} style={questionWrapper}>
                <Typography variant="h5">{game.getQuestion()}</Typography>
            </AnimatedPaper>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    {isThisResponseShown && (
                        <AnimatedPaper elevation={3} style={padding}>
                            <Typography variant="body1">{responses[0].response}</Typography>
                            {isResultsShown && animateVotes(responses[0].response)}
                        </AnimatedPaper>
                    )}
                </Grid>
                <Grid item xs={6}>
                    {isThatResponseShown && (
                        <AnimatedPaper elevation={3} style={padding}>
                            <Typography variant="body1">{responses[1].response}</Typography>
                            {isResultsShown && animateVotes(responses[1].response)}
                        </AnimatedPaper>
                    )}
                </Grid>
            </Grid>

            {showTimer && (
                <RoundTimer
                    initialTime={votingTime}
                    onTimeEnd={handleTimeEnd}
                    sx={{top: 16}}
                />
            )}
        </div>
    )
}

export {ThisOrThat}