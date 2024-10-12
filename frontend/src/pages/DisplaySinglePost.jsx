import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Post from '../components/Post';
import Spinner from '../components/Spinner';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function DisplaySinglePost() {
  const { postId } = useParams(); // Extract postId from route params
  const [post, setPost] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchSinglePost = async () => {
      setLoading(true); // Set loading true before API call
      setError(null); // Reset any previous errors

      try {
        const res = await axios.get(`http://localhost:8000/api/v1/post/single/${postId}`, {
          withCredentials: true, // Ensure cookies/credentials are sent
        });

        if (res.data.success) {
          setPost(res.data.post); 
        } else {
          setError('Post not found');
        }
      } catch (error) {
        setError('Error fetching the post'); 
        console.log('Error fetching post:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSinglePost();
  }, [postId]); 

  if (loading) return <Spinner />; 
  if (error) return <Layout><p>{error}</p></Layout>; // Display error message if error exists
  if (!post) return <Layout><p>No post found</p></Layout>; // Display message if no post is found

  return (
    <Layout>
      <Post key={post?._id} post={post} /> {/* Render the Post component when post exists */}
    </Layout>
  );
}

export default DisplaySinglePost;
