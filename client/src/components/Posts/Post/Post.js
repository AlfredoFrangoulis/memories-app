import React, { useState } from 'react'
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@material-ui/core'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt'
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined'
import DeleteIcon from '@material-ui/icons/Delete'
import EditOutlined from '@material-ui/icons/EditOutlined'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useStyles from './styles'
import { deletePost, likePost } from '../../../actions/posts'

const Post = ({ post, setCurrentId }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const user = JSON.parse(localStorage.getItem('profile'))
  const history = useHistory()
  const [likes, setLikes] = useState(post?.likes)

  const userId = user?.result.sub || user?.result?._id
  const hasLikedPost = post.likes.find((like) => like === userId)

  const handleLike =  async () => {
    dispatch(likePost(post._id))

    if(hasLikedPost) {
      setLikes(post.likes.filter((id) => id !== (userId)))
    } else {
      setLikes([...post.likes, userId])
    }
  }

  const Likes = () => {
    if(likes.length > 0) {
      return likes.find((like) => like === userId)
      ? (
        <><ThumbUpAltIcon fontSize="small" /><Typography variant="caption" display="block">&nbsp;{likes.length > 2 ? `And ${likes.length -1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</Typography></>
      ) : (
        <><ThumbUpAltOutlined fontSize="small" /><Typography variant="caption" display="block">&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</Typography></>
      )
    }

    return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>
  }

  const openPost = () => history.push(`/posts/${post._id}`)
  
  return (
    <Card className={classes.card} raised elevation={6}>
      <ButtonBase className={classes.cardAction} onClick={openPost}>
        <CardMedia className={classes.media} image={post.selectedFile} title={post.title} />

        <div className={classes.overlay}>
          <Typography variant="h6">{post.name}</Typography>
          <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
        </div>

        <div className={classes.details}>
          <Typography variant="body2" color="textSecondary">{post.tags.map((tag) => `#${tag} `)}</Typography>
        </div>

        <Typography className={classes.title} variant="h5" gutterBottom>{post.title}</Typography>
        
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p" style={{ textAlign: 'justify' }}>{post.message}</Typography>
        </CardContent>
      </ButtonBase>

      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike} className={classes.grid}>
          <Likes />
        </Button>
        
        {(user?.result?.sub === post?.creator || user?.result._id === post?.creator) && (    
          <div>
            <Button style={{color: 'green'}} size="small" onClick={() => setCurrentId(post._id)} className={classes.grid}>
              <EditOutlined fontSize="small" />
              <Typography variant="caption" display="block">Edit</Typography>
            </Button>
          </div>
        )}

        {(user?.result?.sub === post?.creator || user?.result._id === post?.creator) && (
          <Button size="small" color="secondary" onClick={() => dispatch(deletePost(post._id))} className={classes.grid}>
            <DeleteIcon fontSize="small" />
            <Typography variant="caption" display="block">Delete</Typography>
          </Button>
        )}

      </CardActions>
    </Card>
  )
}

export default Post