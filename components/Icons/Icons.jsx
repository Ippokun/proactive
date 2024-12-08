export const AddDown = ({fill, size, height, width, ...props}) => {
    return (
      <svg
        fill="none"
        height={size || height || 24}
        viewBox="0 0 24 24"
        width={size || width || 24}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" 
        stroke="#1C274C" strokeWidth="1.5"/>
        <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
         stroke="#1C274C"
          strokeWidth="1.5"
           strokeLinecap="round"
        />
      </svg>
    );
  };
  
  export const Project = ({fill, size, height, width, ...props}) => {
    const color = fill;
  
    return (
      <svg
        height={size || height || 28}
        viewBox="0 0 512 512"
        width={size || width || 24}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="Combined-Shape" fill="#000000" transform="translate(64.000000, 34.346667)">
            <path d="M192,-7.10542736e-15 L384,110.851252 L384,242.986 L341.333,242.986 L341.333,157.655 L213.333,231.555 L213.333,431.088 L192,443.405007 L0,332.553755 L0,110.851252 L192,-7.10542736e-15 Z M341.333333,264.32 L341.333,328.32 L405.333333,328.32 L405.333333,370.986667 L341.333,370.986 L341.333333,434.986667 L298.666667,434.986667 L298.666,370.986 L234.666667,370.986667 L234.666667,328.32 L298.666,328.32 L298.666667,264.32 L341.333333,264.32 Z M42.666,157.654 L42.6666667,307.920144 L170.666,381.82 L170.666,231.555 L42.666,157.654 Z M192,49.267223 L66.1333333,121.936377 L192,194.605531 L317.866667,121.936377 L192,49.267223 Z">
            </path>
          </g>
      </g>
      </svg>
    );
  };
  
  export const List = ({fill, size, height, width, ...props}) => {
    return (
      <svg
        height={size || height || 24}
        viewBox="0 0 24 24"
        width={size || width || 24}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g>
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z"/>
      </g>
      </svg>
    );
  };

  export const Help = ({fill, size, height, width, ...props}) => {
    return (
      <svg
        height={size || height || 24}
        viewBox="0 0 24 24"
        width={size || width || 24}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#323232" stroke-width="2"/>
      <path d="M10.5 8.67709C10.8665 8.26188 11.4027 8 12 8C13.1046 8 14 8.89543 14 10C14 10.9337 13.3601 11.718 12.4949 11.9383C12.2273 12.0064 12 12.2239 12 12.5V12.5V13" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 16H12.01" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    );
  };
  
  