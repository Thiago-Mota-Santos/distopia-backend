import { Context } from "koa";
import { config } from "../../config";

export const recentVideosHandlers = async (ctx: Context): Promise<void> => {
  try {
    
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=Distopia%20Clipes&type=channel&key=${config.YOUTUBE_API_KEY}&maxResults=1`
    );
    const searchData = await searchResponse.json();

    const channelId = searchData.items[0]?.snippet?.channelId;
    if (!channelId) {
      ctx.status = 404;
      ctx.body = { error: "Canal não encontrado" };
      return;
    }

   
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${config.YOUTUBE_API_KEY}`
    );
    const channelData = await channelResponse.json();

    const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) {
      ctx.status = 404;
      ctx.body = { error: "Playlist de vídeos não encontrada" };
      return;
    }

    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&key=${config.YOUTUBE_API_KEY}&maxResults=10`
    );
    const playlistData = await playlistResponse.json();

    const videos = playlistData.items;
    if (!videos?.length) {
      ctx.status = 404;
      ctx.body = { error: "Nenhum vídeo encontrado" };
      return;
    }

    const formattedVideos = videos.map(video => ({
      id: video.snippet.resourceId.videoId,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnails: video.snippet.thumbnails,
      publishedAt: video.snippet.publishedAt
    }));

    ctx.status = 200;
    ctx.body = { videos: formattedVideos };

  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    ctx.status = 500;
    ctx.body = { error: "Erro ao processar a requisição" };
  }
};