import { Box, Button, TextField } from "@mui/material";

export default function LandmarkAddComment(props : any) : JSX.Element {
    return <Box>
        <form action = "/landmark/comments/add" method = "post">
        <TextField id = "comment" name = "comment" multiline maxRows = {3}/>
        <Button variant="contained" justify-self="right">Comment</Button>
    </form>
    </Box>

}