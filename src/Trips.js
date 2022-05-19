import React, { useEffect } from 'react';
import {
    DocumentCard,
    DocumentCardActivity,
    DocumentCardTitle,
  } from '@fluentui/react/lib/DocumentCard';
import { TestImages } from '@fluentui/example-data';
const Trips = ({tripsData}) => {
    useEffect(()=>{

    },[]);
    return(
        <>
            {
                tripsData.map((trip,index)=>{
                    return <div key={index} style={{marginBottom:"10px"}}>
                        <DocumentCard aria-label="Default Document Card with large file name. Created by Annie Lindqvist a few minutes ago."
                            onClickHref=""
                        >
                            <DocumentCardTitle
                            title={`${trip.fromCountry} To ${trip.toCountry}`}
                            shouldTruncate
                            />
                            <div style={{marginLeft:"20px",fontSize:"12px"}}>
                                <ul>
                                    <li>Start Date:{trip.startDate}</li>
                                    <li>End Date:{trip.endDate}</li>
                                </ul>
                            </div>
                            <DocumentCardActivity activity="Created a few minutes ago" people={[{ name: 'Annie Lindqvist', profileImageSrc: TestImages.profileImageSrc }]} />
                        </DocumentCard>
                    </div>
                })
            }
        </>
    );
}
export default Trips;