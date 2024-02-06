import { Component, ChangeDetectorRef, OnDestroy, NgZone } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AudioService } from '../Services/audio.service';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.css']
})
export class NavHeaderComponent {
  menuType: String = 'default';
  teacherEmail: String = '';
  learnerEmail: String = '';
  profilePictureUrl: string = ''
  userId: string = ''

  mediaRecorder: any;
  chunks: any[] = [];
  isRecording = false;
  transcription: string = '';

  constructor(private router: Router,
    private audioService: AudioService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone) { }

  ngOnInit() {

    this.router.events.subscribe((val: any) => {
      // console.warn(val)
      if (val.url) {
        if (localStorage.getItem('teacher') && val.url.includes('educationhomepage')) {
          // console.warn('in tecaher area')
          this.menuType = 'teachereducation'

          if (localStorage.getItem('teacher')) {
            const teacherStore = localStorage.getItem('teacher');

            try {
              const teacherData = JSON.parse(teacherStore!);

              if (teacherData && teacherData.email && teacherData.user_id) {
                this.userId = teacherData.user_id
                // console.log(teacherData.email);
                this.teacherEmail = teacherData.email.split('@')[0];
                if (teacherData.profile_picture) {


                  this.profilePictureUrl = teacherData.profile_picture
                }

              } else {
                console.error('Invalid teacher data format or missing email property');
              }
            } catch (error) {
              console.error('Error parsing teacher data:', error);
            }
          }





        }
        else if (localStorage.getItem('learner') && val.url.includes('educationhomepage')) {
          // console.warn('in learner area')
          this.menuType = 'learnereducation'

          if (localStorage.getItem('learner')) {
            const learnerStore = localStorage.getItem('learner');

            try {
              const learnerData = JSON.parse(learnerStore!);

              if (learnerData && learnerData.email && learnerData.user_id) {
                this.userId = learnerData.user_id
                // console.log(learnerData.email);
                this.learnerEmail = learnerData.email.split('@')[0];
                if (learnerData.profile_picture) {


                  this.profilePictureUrl = learnerData.profile_picture
                }
              } else {
                console.error('Invalid learner data format or missing email property');
              }
            } catch (error) {
              console.error('Error parsing teacher data:', error);
            }
          }
        }
        else {
          // console.warn('outside teacher')
          // this.menuType = 'default'

        }
      }

    })
    console.warn(this.menuType)


    this.router.events.subscribe((val: any) => {
      // console.warn(val)
      if (val.url) {
        if (localStorage.getItem('teacher') && val.url.includes('teacher')) {
          // console.warn('in tecaher area')
          this.menuType = 'teacher'

          if (localStorage.getItem('teacher')) {
            const teacherStore = localStorage.getItem('teacher');

            try {
              const teacherData = JSON.parse(teacherStore!);

              if (teacherData && teacherData.email && teacherData.user_id) {
                this.userId = teacherData.user_id
                // console.log(teacherData.email);
                this.teacherEmail = teacherData.email.split('@')[0];
                if (teacherData.profile_picture) {


                  this.profilePictureUrl = teacherData.profile_picture
                }

              } else {
                console.error('Invalid teacher data format or missing email property');
              }
            } catch (error) {
              console.error('Error parsing teacher data:', error);
            }
          }





        }
        else if (localStorage.getItem('learner') && val.url.includes('learner')) {
          // console.warn('in learner area')
          this.menuType = 'learner'

          if (localStorage.getItem('learner')) {
            const learnerStore = localStorage.getItem('learner');

            try {
              const learnerData = JSON.parse(learnerStore!);

              if (learnerData && learnerData.email && learnerData.user_id) {
                this.userId = learnerData.user_id
                // console.log(learnerData.email);
                this.learnerEmail = learnerData.email.split('@')[0];
                if (learnerData.profile_picture) {


                  this.profilePictureUrl = learnerData.profile_picture
                }
              } else {
                console.error('Invalid learner data format or missing email property');
              }
            } catch (error) {
              console.error('Error parsing teacher data:', error);
            }
          }
        }
        else {
          // console.warn('outside teacher')
          // this.menuType = 'default'

        }
      }

    })

  }

  teacherLogout() {
    localStorage.removeItem('teacher');
    this.router.navigate(['/'])
  }

  learnerLogout() {
    localStorage.removeItem('learner');
    this.router.navigate(['/'])
  }



  startFunction() {
    this.transcription = '';

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
          if (e.data.size > 0) {
            this.chunks.push(e.data);
          }
        };

        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.chunks, { type: 'audio/wav' });
          this.chunks = [];

          const audioFile = new File([audioBlob], 'recorded.wav', { type: 'audio/wav' });

          this.audioService.uploadAudio(audioFile).subscribe(
            (response) => {
              console.log('Transcription:', response.transcription);
              this.transcription = response.transcription;
              this.cdr.detectChanges(); // Manually trigger change detection
            },
            (error) => {
              console.error('Error transcribing audio:', error);
            }
          );
        };

        this.mediaRecorder.start();
        this.isRecording = true;
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  }

  stopFunction() {
    if (this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

}
