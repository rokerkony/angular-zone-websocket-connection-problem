import {Component, OnInit} from '@angular/core';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {TeardownLogic} from 'rxjs/Subscription';
import {Subscriber} from 'rxjs/Subscriber';
import 'rxjs/add/operator/mergeMap';
import {MyWindow} from '../typings';

export interface ReceivedMessage {
  channel: GroupChannel;
  message: UserMessage;
}

@Injectable()
export class ChatService {
  public incomingMessage: BehaviorSubject<ReceivedMessage> = new BehaviorSubject(undefined);

  private channelId: string;
  private channelHandler: ChannelHandler_Instance;
  private channel: OpenChannel;
  private user: User;
  private sendbird: SendBird_Instance;

  constructor () {
    // TODO: CHANGE IT TO CORRECT APP ID
    this.sendbird = new (<MyWindow> window).SendBird({appId: '--- APP ID ---'});
  }

  public createConnection (userId: string, accessToken: string, channelId: string): Observable<void> {
    this.channelHandler = new this.sendbird.ChannelHandler();
    this.sendbird.addChannelHandler('Room handler', this.channelHandler);

    this.channelHandler.onMessageReceived = (channel: GroupChannel, message: UserMessage): void => {
      this.incomingMessage.next({channel, message});
    };

    return this.connect(userId, accessToken)
      .mergeMap(() => this.joinChannel(channelId));
  }

  private connect (userId: string, accessToken: string): Observable<void> {
    return new Observable((observer: Subscriber<void>): TeardownLogic => {
      this.sendbird.connect(userId, accessToken, (user: User, connectError: any) => {
        if (user) {
          this.user = user;
          observer.next();
          observer.complete();
        } else {
          observer.error(connectError);
        }
      });
    });
  }

  private joinChannel (channelId: string): Observable<void> {
    return new Observable((observer: Subscriber<void>): TeardownLogic => {
      this.sendbird.GroupChannel.getChannel(channelId, (channel: OpenChannel, channelError: any) => {
        if (channel) {
          this.channel = channel;
          this.channelId = channelId;
          observer.next();
          observer.complete();
        } else {
          observer.error(channelError);
        }
      });
    });
  }
}

@Component({
  selector: 'app-root',
  template: `
    <h1>
      Welcome, result is:
      <strong *ngIf="result !== 'connected'">{{result}}</strong>
      <span *ngIf="result === 'connected'">{{result}}</span>
    </h1>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public result = 'WRONG';

  constructor (private chatService: ChatService) {}

  ngOnInit (): void {
    this.chatService.createConnection(
      // TODO: CHANGE IT TO CORRECT TOKEN VALUES
      '95666b98-17d2-5a87-8062-7840f8d63599',
      '4cc3001fbcd8d41e576813ef6a196781d453bd7f',
      'sendbird_group_channel_33897311_268167c7afe4862dadc2c8a30e7af55db10b4440',
    ).subscribe(() => {
      console.log('YES CONNECTED!!!');
      this.result = 'connected'
    })
  }
}
