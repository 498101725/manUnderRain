using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Demo.RNDemo
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNDemoModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNDemoModule"/>.
        /// </summary>
        internal RNDemoModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNDemo";
            }
        }
    }
}
