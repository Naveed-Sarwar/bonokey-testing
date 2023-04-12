import React from "react";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styled from "styled-components";
import { brandColors, uiBreakpoint } from "../../../utils/helpers";

type Props = {};

function BanksSkeletons(props: Props) {
    return (
        <SkeletonTheme baseColor={brandColors.white} highlightColor={brandColors.captionBlack + "25"}>
            <div style={{ maxWidth: "1488px", margin: "0 auto", textAlign: "center" }}>
                <Skeleton height={120} style={{ marginBottom: "48px", borderRadius: "10px" }} />
                <Skeleton height={120} style={{ marginBottom: "48px", borderRadius: "10px" }} />
                <Skeleton height={120} style={{ marginBottom: "48px", borderRadius: "10px" }} />
                <Skeleton height={120} style={{ marginBottom: "48px", borderRadius: "10px" }} />
                <Skeleton height={120} style={{ marginBottom: "48px", borderRadius: "10px" }} />
                <Skeleton height={120} style={{ marginBottom: "48px", borderRadius: "10px" }} />
            </div>
        </SkeletonTheme>
    );
}

export default BanksSkeletons;
