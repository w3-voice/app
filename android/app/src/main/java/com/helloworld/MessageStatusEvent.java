package com.helloworld;

import android.os.Parcel;
import android.os.Parcelable;

public class MessageStatusEvent implements Parcelable {
    String msgID;
    String status;

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(this.msgID);
        dest.writeString(this.status);
    }

    public void readFromParcel(Parcel source) {
        this.msgID = source.readString();
        this.status = source.readString();
    }

    public MessageStatusEvent() {
    }

    protected MessageStatusEvent(Parcel in) {
        this.msgID = in.readString();
        this.status = in.readString();
    }

    public static final Parcelable.Creator<MessageStatusEvent> CREATOR = new Parcelable.Creator<MessageStatusEvent>() {
        @Override
        public MessageStatusEvent createFromParcel(Parcel source) {
            return new MessageStatusEvent(source);
        }

        @Override
        public MessageStatusEvent[] newArray(int size) {
            return new MessageStatusEvent[size];
        }
    };
}
