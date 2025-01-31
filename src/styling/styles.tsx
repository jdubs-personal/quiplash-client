import CSS from "csstype";
import {theme} from "./theme";

const card: CSS.Properties = {
    padding: "10px",
    margin: "20px",
}

const colorCard: CSS.Properties = {
    padding: "10px",
    margin: "20px",
    backgroundColor: theme.palette.secondary.main
}

const cardLobby: CSS.Properties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: "10px",
    margin: "0 auto",
    marginBottom: "20px"
};

const questionWrapper: CSS.Properties ={
    padding: '20px',
    marginBottom: '20px'
}

const votesContainer: CSS.Properties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "12px"
}

const padding: CSS.Properties = {
    padding: '20px'
}

const displayResponse: CSS.Properties = {
    padding: '20px',
    wordWrap: "break-word"
}

const animatedText: CSS.Properties = {
    fontSize: "2rem",
    animation: "bounce 1.5s infinite"
};

const paragraph: CSS.Properties = {
    marginTop: "20px",
    animation: "fadeIn 3s ease-in-out",
};

const characterImage: CSS.Properties = {
    width: "7rem",
    height: "7rem"
}

const titleImage: CSS.Properties = {
    width: "30rem",
    height: "30rem",
}

const smallTitleImage: CSS.Properties = {
    width: "15rem",
    height: "15rem",
}

export {card, colorCard,cardLobby, animatedText, paragraph, questionWrapper, votesContainer,
    padding, displayResponse, characterImage, titleImage, smallTitleImage };