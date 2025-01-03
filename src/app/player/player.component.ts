import {
  Component, OnInit,
  signal,
  computed,
  ViewChild,
  ElementRef
} from '@angular/core';

import { NgClass } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStepBackward, faStepForward, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';



interface Track {
  title: string;
  artist: string;
  url: string;
  id?: string;
  year?: number;
}


@Component({
  selector: 'app-player',
  imports: [NgClass, FontAwesomeModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})



export class PlayerComponent {
  @ViewChild('trackListContainer') trackListContainer!: ElementRef;
  faStepBackward = faStepBackward
  faStepForward = faStepForward
  faPlay = faPlay
  faPause = faPause


  tracks: Track[] = [
    {
      id: 'aznsjhg',
      title: 'Sofia',
      artist: 'Alvaro Soler',
      year: 2016,
      url: 'audios/Alvaro Soler - Sofia [qaZ0oAh4evU].mp3',
    },
    {
      id: 'xmvbd',
      title: 'Mis Amigos',
      artist: 'Amaral',
      url: 'audios/Amaral： Mis Amigos - (audio and lyrics ⧸ audio y letras). [2oDnJQaHWZ4].mp3',
    },
    {
      id: 'cnsjf',
      title: 'Toxic',
      artist: 'Britney Spears',
      url: 'audios/Britney Spears - Toxic (Official HD Video) [LOZuxwVk7TU].mp3',
    },
    {
      title: 'Classical Symphony',
      artist: 'Orchestra Ensemble',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    },
    {
      title: 'Electronic Dreams',
      artist: 'Synthwave Collective',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    },
    {
      title: 'Ambient Relaxation',
      artist: 'Chillout Lounge',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    },
    {
      title: 'Country Folk',
      artist: 'Acoustic Guitar Trio',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    },
    {
      title: 'Rocking Blues',
      artist: 'Electric Guitar Band',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    },
    {
      title: 'Hip Hop Beats',
      artist: 'Rap Collective',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    },
    {
      title: 'Reggae Vibes',
      artist: 'Island Rhythms',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    }
  ];

  currentTrackIndex = signal(0);
  isPlaying = signal(false);
  progress = signal(0);
  error = signal<string | null>(null);
  private audio: HTMLAudioElement | null = null;

  constructor(private route: ActivatedRoute) { }


  ngOnInit() {
    this.route.params.subscribe(params => {
      const trackId = params['id'];
      console.log('trackId', trackId);

      if (trackId) {
        const trackIndex = this.tracks.findIndex(track => track.id === trackId);
        if (trackIndex !== -1) {
          this.currentTrackIndex.set(trackIndex);
        }
      }
    });
   
    this.loadTrack();
  }


  loadTrack() {
    this.audio?.pause();
    this.audio = new Audio(this.tracks[this.currentTrackIndex()].url);

    this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
    this.audio.addEventListener('ended', this.handleNext.bind(this));
    this.audio.addEventListener('canplay', () => this.error.set(null));
    this.audio.addEventListener('error', () => {
      this.error.set('Unable to load audio. Please check the audio source.');
      this.isPlaying.set(false);
    });
  }

  handlePlayPause() {
    if (this.audio) {
      if (this.isPlaying()) {
        this.audio.pause();
      } else {
        this.audio.play().catch(() => {
          this.error.set('Playback failed. Please try again.');
        });
      }
      this.isPlaying.set(!this.isPlaying());
    }
  }

  scrollToCurrentTrack() {
    const container = this.trackListContainer.nativeElement;
    const selectedTrack = container.children[this.currentTrackIndex()];
    if (selectedTrack) {
      selectedTrack.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  handleNext() {
    this.currentTrackIndex.set(
      (this.currentTrackIndex() + 1) % this.tracks.length
    );
    this.loadTrack();
    this.isPlaying.set(true);
    this.audio?.play();
    this.scrollToCurrentTrack();
  }

  handlePrevious() {
    this.currentTrackIndex.set(
      (this.currentTrackIndex() - 1 + this.tracks.length) % this.tracks.length
    );
    this.loadTrack();
    this.isPlaying.set(true);
    this.audio?.play();
    this.scrollToCurrentTrack();
  }

  handleTrackSelect(index: number) {
    this.currentTrackIndex.set(index);
    this.loadTrack();
    this.isPlaying.set(true);
    this.audio?.play();
    this.scrollToCurrentTrack();
  }

  handleSeek(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    this.progress.set(value);

    if (this.audio) {
      const newTime = (value / 100) * this.audio.duration;
      this.audio.currentTime = newTime;
    }
  }

  updateProgress() {
    if (this.audio) {
      const duration = this.audio.duration || 1;
      const currentTime = this.audio.currentTime;
      this.progress.set((currentTime / duration) * 100);
    }
  }

}
