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
      id: 'pdewofj',
      title: '',
      artist: 'Orchestra Ensemble',
      url: 'Coldplay - Viva La Vida (Official Video) [dvgZkm1xWPE].mp3',
    },
    {
      id: 'wwjfhg',
      title: '',
      artist: '',
      url: 'Don Omar - Danza Kuduro ft. Lucenzo [7zp1TbLFPp8].mp3',
    },
    {
      id: 'dnsht',
      title: '',
      artist: '',
      url: 'Els Catarres - Rock and Roll (acords i lletra) [gCGGtdcM-FA].mp3',
    },
    {
      id: 'ofight',
      title: '',
      artist: '',
      url: 'LA GRAN EUFÒRIA (VIDEOCLIP OFICIAL) - JOAN DAUSÀ [U6aTHT2wIH8].mp3',
    },
    {
      id: 'podifg',
      title: '',
      artist: '',
      url: 'Luis Fonsi - Despacito ft. Daddy Yankee [kJQP7kiw5Fk].mp3',
    },
    {
      id: 'cmekwf',
      title: '',
      artist: '',
      url: 'Mark Ronson - Uptown Funk (Official Video) ft. Bruno Mars [OPf0YbXqDm0].mp3',
    },
    {
      id: 'ckgnrof',
      title: '',
      artist: '',
      url: 'Nena Daconte - Tenia Tanto Que Darte [rd8ZFtD5rM8].mp3',
    },
    {
      id: 'oejfi',
      title: '',
      artist: '',
      url: 'One Direction - Drag Me Down (Official Video) [Jwgf3wmiA04].mp3',
    }, {
      id: 'ghwowkfg',
      title: '',
      artist: '',
      url: 'Paulina Rubio - Ni Una Sola Palabra (Video Oficial) [Kkdhtb9DVWQ].mp3',
    },
    {
      id: 'feijeig',
      title: '',
      artist: '',
      url: 'PSY - GANGNAM STYLE(강남스타일)[9bZkp7q19f0].mp3',
    },
    {
      id: 'bvkrd',
      title: '',
      artist: '',
      url: 'Rauw Alejandro - Todo de Ti (Video Oficial) [CFPLIaMpGrY].mp3',
    },
    {
      id: 'mdwekmdwe',
      title: '',
      artist: '',
      url: 'Rigoberta Bandini - AY MAMÁ (Videoclip) [-z9qeALR7j0].mp3',
    }, {
      id: 'cnvkf',
      title: '',
      artist: '',
      url: 'Rihanna - Umbrella (Orange Version) (Official Music Video) ft. JAY-Z [CvBfHwUxHIk].mp3',
    },
    {
      id: 'dwqopdqf',
      title: '',
      artist: '',
      url: 'ROSALÍA - F＊cking Money Man (Milionària + Dio$ No$ Libre Del Dinero) (Official Video) [eQCpjOBJ5UQ].mp3',
    },
    {
      id: 'rokgoerhe',
      title: '',
      artist: '',
      url: 'STAY HOMAS, Judit Neddermann - Gotta Be Patient (Confination Song VI) [Hd0cN9HZIK8].mp3',
    },
    {
      id: 'pwpfofjg',
      title: '',
      artist: '',
      url: 'The Black Eyed Peas - I Gotta Feeling (Official Music Video) [uSD4vsh1zDA].mp3',
    },
    {
      id: 'weddmqwd',
      title: '',
      artist: '',
      url: 'The Tyets - Olívia (subtítols i lletra en català) [4_ZiTdqYmuY].mp3',
    },

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
